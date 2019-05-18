const functions = require('firebase-functions');

// const bodyParser = require('body-parser');
const util = require('util');

const express = require('express');
const cors = require('cors');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const firebaseAdmin = require('firebase-admin');
const path = require('path');
const session = require('cookie-session');
const serviceAccount = require('./jwt-key.json')


firebaseAdmin.initializeApp({
  credential:firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
})


const {smarthome} = require('actions-on-google');
const config = require('./config-provider');
const SmartHomeApp = smarthome({jwt:config.jwt});

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_API_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithm: 'RS256'
});

const app = express()
app.use(session({
  name: 'session',
  keys: ['YQVNzOc7kC2cFTcdguwArPMPyinrHgLS','ZIc8PlleHh0CWIDPLJC6VTZAPdr3yXOE']
}));
app.use(cors(/* {origin: true} */))


app.get('/firebase', jwtCheck, async (req, res) => {
  const {sub: uid} = req.user;

  try {
    const firebaseToken = await firebaseAdmin.auth().createCustomToken(uid);
    res.json({firebaseToken});
  } catch (err) {
    res.status(500).send({
      message: 'Something went wrong acquiring a Firebase token.',
      error: err
    });
  }
});

app.get("/action",(request, response) => {
  console.log("Request",request.body)
    switch (request.body.inputs[0].intent) {
        case "action.devices.SYNC":
            SmartHomeApp.onSync((body, headers) => {
                return {
                    requestId: body.requestId,
                    payload: {
                        agentUserId: "1836.15267389",
                        devices: [{
                            id: "123",
                            type: "action.devices.types.OUTLET",
                            traits: [
                                "action.devices.traits.OnOff"
                            ],
                            name: {
                                defaultNames: ["My Outlet 1234"],
                                name: "Night light",
                                nicknames: ["wall plug"]
                            },
                            willReportState: false,
                            roomHint: "kitchen",
                            deviceInfo: {
                                manufacturer: "lights-out-inc",
                                model: "hs1234",
                                hwVersion: "3.2",
                                swVersion: "11.4"
                            },
                            customData: {
                                fooValue: 74,
                                barValue: true,
                                bazValue: "foo"
                            }
                        }, {
                            id: "456",
                            type: "action.devices.types.LIGHT",
                            traits: [
                                "action.devices.traits.OnOff",
                                "action.devices.traits.Brightness",
                                "action.devices.traits.ColorTemperature",
                                "action.devices.traits.ColorSpectrum"
                            ],
                            name: {
                                defaultNames: ["lights out inc. bulb A19 color hyperglow"],
                                name: "lamp1",
                                nicknames: ["reading lamp"]
                            },
                            willReportState: false,
                            roomHint: "office",
                            attributes: {
                                temperatureMinK: 2000,
                                temperatureMaxK: 6500
                            },
                            deviceInfo: {
                                manufacturer: "lights out inc.",
                                model: "hg11",
                                hwVersion: "1.2",
                                swVersion: "5.4"
                            },
                            customData: {
                                fooValue: 12,
                                barValue: false,
                                bazValue: "bar"
                            }
                        }]
                    }
                };

            })
            break;
        // Blilerplate code
        case "action.devices.QUERY":
        SmartHomeApp.onQuery((body,headers)=>{
            // TODO Get device state
            return {
              requestId: body.requestId,
              payload: {
                devices: {
                  123: {
                    on: true,
                    online: true
                  },
                  456: {
                    on: true,
                    online: true,
                    brightness: 80,
                    color: {
                      name: "cerulean",
                      spectrumRGB: 31655
                    }
                  }
                }
              }
            };
        })
        case "action.devices.SOMETING":
            SmartHomeApp.doSomething((body,headers)=>{})
        default:
            break;
    }
})

app.use('/frontend',express.static(path.join(__dirname, 'frontend')))

exports.ActionsOnGoogle = app
exports.ReportState = ()=>{
    return SmartHomeApp.reportState({
        requestId: '123ABC',
        agentUserId: 'user-123',
        payload: {
          devices: {
            states: {
              "light-123": {
                on: true
              }
            }
          }
        }
      })
      .then((res) => {
        // Report state was successful
      })
      .catch((res) => {
        // Report state failed
      });
      
}