// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * This auth is going to use the Authorization Code flow, described in the docs:
 * https://developers.google.com/actions/identity/oauth2-code-flow
 */

/* eslint require-jsdoc: "off" */
/* eslint valid-jsdoc: "off" */

const Auth = {};
const express = require('express');
const authstore = require('./datastore').Auth;
const util = require('util');
// eslint-disable-next-line no-unused-vars
const session = require('express-session');

Auth.getAccessToken = function(request) {
  return request.headers.authorization ?
      request.headers.authorization.split(' ')[1] : null;
};
Auth.getUid = function(request) {
  return request.headers.uid;
};

const SmartHomeModel = {};

function genUid() {
  let uid = Math.floor(Math.random() * 1000).toString();
  while (authstore.users[uid]) {
    uid = genUid();
  }
  return uid;
}

function genRandomString() {
  return Math.floor(Math.random() *
      10000000000000000000000000000000000000000).toString(36);
}

SmartHomeModel.genUser = function(username, password) {
  let uid = genUid();
  let token = genRandomString();

  authstore.usernames[username] = uid;
  authstore.users[uid] = {
    uid: uid,
    name: username,
    password: password,
    tokens: [token],
  };
  authstore.tokens[token] = {
    uid: uid,
    accessToken: token,
    refreshToken: token,
  };
};

SmartHomeModel.generateAuthCode = function(uid, clientId) {
  let authCode = genRandomString();
  authstore.authcodes[authCode] = {
    type: 'AUTH_CODE',
    uid: uid,
    clientId: clientId,
    expiresAt: new Date(Date.now() + (60 * 10000)),
  };
  return authCode;
};

SmartHomeModel.getAccessToken = function(code) {
  let authCode = authstore.authcodes[code];
  if (!authCode) {
    console.error('invalid code');
    return false;
  }
  if (new Date(authCode.expiresAt) < Date.now()) {
    console.error('expired code');
    return false;
  }

  let user = authstore.users[authCode.uid];
  if (!user) {
    console.error('could not find user');
    return false;
  }
  let accessToken = authstore.tokens[user.tokens[0]];
  console.log('getAccessToken = ', accessToken);
  if (!accessToken || !accessToken.uid) {
    console.error('could not find accessToken');
    return false;
  }

  let returnToken = {
    token_type: 'bearer',
    access_token: accessToken.accessToken,
    refresh_token: accessToken.refreshToken,
  };

  console.log('return getAccessToken = ', returnToken);
  return returnToken;
};

SmartHomeModel.getClient = function(clientId, clientSecret) {
  console.log('getClient %s, %s', clientId, clientSecret);
  let client = authstore.clients[clientId];
  if (!client || (client.clientSecret != clientSecret)) {
    console.log('clientSecret doesn\'t match %s, %s',
        client.clientSecret, clientSecret);
    return false;
  }

  console.log('return getClient', client);
  return client;
};

SmartHomeModel.getUser = function(username, password) {
  console.log('getUser', username);
  let userId = authstore.usernames[username];
  if (!userId) {
    console.log('not a user', userId);
    SmartHomeModel.genUser(username, password);
    userId = authstore.usernames[username];
    if (!userId) {
      console.log('failed to genUser', userId);
      return false;
    }
  }

  let user = authstore.users[userId];
  if (!user) {
    console.log('not a user', user);
    return false;
  }
  if (user.password != password) {
    console.log('passwords do not match!', user);
    return false;
  }

  return user;
};

Auth.registerAuth = function(app) {
  /**
   * expecting something like the following:
   *
   * GET https://myservice.example.com/auth? \
   *   client_id=GOOGLE_CLIENT_ID
   *      - The Google client ID you registered with Google.
   *   &redirect_uri=REDIRECT_URI
   *      - The URL to which to send the response to this request
   *   &state=STATE_STRING
   *      - A bookkeeping value that is passed back to Google unchanged
   *          in the result
   *   &response_type=code
   *      - The string code
   */
  app.get('/oauth', function(req, res) {
    let clientId = req.query.client_id;
    let redirectUri = req.query.redirect_uri;
    let state = req.query.state;
    let responseType = req.query.response_type;
    let authCode = req.query.code;

    if ('code' != responseType) {
      return res.status(500)
        .send('response_type ' + responseType + ' must equal "code"');
    }

    if (!authstore.clients[clientId]) {
      return res.status(500).send('client_id ' + clientId + ' invalid');
    }

    // if you have an authcode use that
    if (authCode) {
      return res.redirect(util.format('%s?code=%s&state=%s',
        redirectUri, authCode, state
      ));
    }

    let user = req.session.user;
    // Redirect anonymous users to login page.
    if (!user) {
      return res.redirect(util.format(
          '/login?client_id=%s&redirect_uri=%s&redirect=%s&state=%s',
          clientId, encodeURIComponent(redirectUri), req.path, state));
    }

    console.log('login successful ', user.name);
    authCode = SmartHomeModel.generateAuthCode(user.uid, clientId);

    if (authCode) {
      console.log('authCode successful ', authCode);
      return res.redirect(util.format('%s?code=%s&state=%s',
        redirectUri, authCode, state));
    }

    return res.status(400).send('something went wrong');
  });

  app.use('/login', express.static('./frontend/login.html'));

  // Post login.
  app.post('/login', function(req, res) {
    console.log('/login ', req.body);
    let user = SmartHomeModel.getUser(req.body.username, req.body.password);
    if (!user) {
      console.log('not a user', user);
      return res.redirect(util.format(
          '%s?client_id=%s&redirect_uri=%s&state=%s&response_type=code',
          '/frontend', req.body.client_id,
          encodeURIComponent(req.body.redirect_uri), req.body.state));
    }

    console.log('logging in ', user);
    req.session.user = user;

    // Successful logins should send the user back to /oauth/.
    let path = decodeURIComponent(req.body.redirect) || '/frontend';

    console.log('login successful ', user.name);
    let authCode = SmartHomeModel.generateAuthCode(user.uid,
        req.body.client_id);

    if (authCode) {
      console.log('authCode successful ', authCode);
      return res.redirect(util.format('%s?code=%s&state=%s',
        decodeURIComponent(req.body.redirect_uri), authCode, req.body.state));
    } else {
      console.log('authCode failed');
      return res.redirect(util.format(
          '%s?client_id=%s&redirect_uri=%s&state=%s&response_type=code',
          path, req.body.client_id, encodeURIComponent(req.body.redirect_uri),
          req.body.state));
    }
  });

  // /**
  //  * client_id=GOOGLE_CLIENT_ID
  //  * &client_secret=GOOGLE_CLIENT_SECRET
  //  * &response_type=token
  //  * &grant_type=authorization_code
  //  * &code=AUTHORIZATION_CODE
  //  *
  //  * OR
  //  *
  //  *
  //  * client_id=GOOGLE_CLIENT_ID
  //  * &client_secret=GOOGLE_CLIENT_SECRET
  //  * &response_type=token
  //  * &grant_type=refresh_token
  //  * &refresh_token=REFRESH_TOKEN
  //  */
  app.all('/token', function(req, res) {
    console.log('/token query', req.query);
    console.log('/token body', req.body);
    let clientId = getClientValue('client_id', req);
    let clientSecret = getClientValue('client_secret', req);
    let grantType = req.query.grant_type
        ? req.query.grant_type : req.body.grant_type;

    if (!clientId || !clientSecret) {
      console.error('missing required parameter');
      return res.status(400).send('missing required parameter');
    }

    let client = SmartHomeModel.getClient(clientId, clientSecret);
    console.log('client', client);
    if (!client) {
      console.error('incorrect client data');
      return res.status(400).send('incorrect client data');
    }

    if ('authorization_code' == grantType) {
      return handleAuthCode(req, res);
    } else if ('refresh_token' == grantType) {
      return handleRefreshToken(req, res);
    } else {
      console.error('grant_type ' + grantType + ' is not supported');
      return res.status(400)
          .send('grant_type ' + grantType + ' is not supported');
    }
  });
};


// code=wk41krp1kz4s8cs00s04s8o4s
// &redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground
// &client_id=RKkWfsi0Z9
// &client_secret=eToBzeBT7OwrPQO8mZHsZtLp1qhQbe
// &scope=
// &grant_type=authorization_code


/**
 * Decode authorization into client_id and client_secret.
 * @param {Object} req ExpressJS request object
 * @return {{}}
 * {
 *   client_id: "CLIENT_ID",
 *   client_secret: "CLIENT_SECRET"
 * }
 */
function getHeaderAuthorization(req){
  try {
    if (!req.headers.authorization) return {};

    const authorizationString = Buffer.from(req.headers.authorization.split(" ")[1], 'base64').toString();
    if(!authorizationString) return {};

    const [client_id, client_secret] = authorizationString.split(':');
    return {
      client_id,
      client_secret
    }
  } catch (e) {
    console.error("Error while parsing authorization header", e);
    return {};
  }
  return {};
}

/**
 * Get client's key from the following order:
 *   - Request's query string
 *   - Request's body
 *   - Request's header (from `authorization`)
 * @param {string} key Client's key
 * @param {Object} req ExpressJS request object
 * @return {(string|undefined)} Return either client's value or `undefined` if it doesn't exist.
 */
function getClientValue(key, req){
  if(!!req.query[key]) return req.query[key];
  if(!!req.body[key]) return req.body[key];

  const headerAuthor = getHeaderAuthorization(req);
  if(!!headerAuthor[key]) return headerAuthor[key];

  return undefined;
}

/**
 * @return {{}}
 * {
 *   token_type: "bearer",
 *   access_token: "ACCESS_TOKEN",
 *   refresh_token: "REFRESH_TOKEN"
 * }
 */
function handleAuthCode(req, res) {
  console.log('handleAuthCode', req.query);
  let clientId = getClientValue('client_id', req);
  let clientSecret = getClientValue('client_secret', req);
  let code = req.query.code ? req.query.code : req.body.code;

  let client = SmartHomeModel.getClient(clientId, clientSecret);

  if (!code) {
    console.error('missing required parameter');
    return res.status(400).send('missing required parameter');
  }
  if (!client) {
    console.error('invalid client id or secret %s, %s',
        clientId, clientSecret);
    return res.status(400).send('invalid client id or secret');
  }

  let authCode = authstore.authcodes[code];
  if (!authCode) {
    console.error('invalid code');
    return res.status(400).send('invalid code');
  }
  if (new Date(authCode.expiresAt) < Date.now()) {
    console.error('expired code');
    return res.status(400).send('expired code');
  }
  if (authCode.clientId != clientId) {
    console.error('invalid code - wrong client', authCode);
    return res.status(400).send('invalid code - wrong client');
  }

  let token = SmartHomeModel.getAccessToken(code);
  if (!token) {
    console.error('unable to generate a token', token);
    return res.status(400).send('unable to generate a token');
  }

  console.log('respond success', token);
  return res.status(200).json(token);
}

/**
 * @return {{}}
 * {
 *   token_type: "bearer",
 *   access_token: "ACCESS_TOKEN",
 * }
 */
function handleRefreshToken(req, res) {
  let clientId = getClientValue('client_id', req);
  let clientSecret = getClientValue('client_secret', req);
  let refreshToken = req.query.refresh_token
      ? req.query.refresh_token : req.body.refresh_token;

  let client = SmartHomeModel.getClient(clientId, clientSecret);
  if (!client) {
    console.error('invalid client id or secret %s, %s',
        clientId, clientSecret);
    return res.status(500).send('invalid client id or secret');
  }

  if (!refreshToken) {
    console.error('missing required parameter');
    return res.status(500).send('missing required parameter');
  }

  res.status(200).json({
    token_type: 'bearer',
    access_token: refreshToken,
  });
}

// eslint-disable-next-line no-unused-vars
function login(req, res) {
  return res.render('login', {
    redirect: encodeURIComponent(req.query.redirect),
    client_id: req.query.client_id,
    state: req.query.state,
    redirect_uri: encodeURIComponent(req.query.redirect_uri),
  });
}

exports.genRandomString = genRandomString;
exports.registerAuth = Auth.registerAuth;
exports.getAccessToken = Auth.getAccessToken;
exports.getUid = Auth.getUid;
