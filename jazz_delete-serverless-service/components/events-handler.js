// =========================================================================
// Copyright © 2017 T-Mobile USA, Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =========================================================================

const request = require('request');
const moment = require('moment');

module.exports = (request_id) => {
  var eventsObj = {
    sendEvent: function (inputs, callback) {
      if (inputs.service_context === undefined || inputs.service_context === "" || Object.keys(inputs.service_context).length === 0) {
        return {
          "error": true,
          "message": "EVENT HANDLER: Context is Empty"
        };
      }
      if (inputs.service_name === undefined || inputs.service_name === "") {
        return {
          "error": true,
          "message": "EVENT HANDLER: service_name not provided"
        };
      }
      if (inputs.event_status === undefined || inputs.event_status === "") {
        return {
          "error": true,
          "message": "EVENT HANDLER: event_status not provided"
        };
      }
      if (inputs.username === undefined || inputs.username === "") {
        return {
          "error": true,
          "message": "EVENT HANDLER: service_name not provided"
        };
      }
      var done = false;
      var data;
      var eventOptions = {
        uri: inputs.SERVICE_API_URL + inputs.EVENTS_API_RESOURCE,
        method: 'POST',
        json: {
          "service_context": inputs.service_context,
          "event_handler": inputs.event_handler,
          "event_name": inputs.event_name,
          "service_name": inputs.service_name,
          "event_status": inputs.event_status,
          "event_type": inputs.event_type,
          "username": inputs.username,
          "event_timestamp": moment().utc().format('YYYY-MM-DDTHH:mm:ss:SSS'),
          "request_id": request_id
        },
        rejectUnauthorized: false
      };

      request(eventOptions, function (error, response, body) {
        if (error) {
          data = {
            "error": true,
            "message": error.message
          };
          callback(data, null);
        } else if (response.statusCode !== 200) {
          data = {
            "error": true,
            "message": body.message
          };
          callback(data, null);
        } else {
          data = {
            "error": false,
            "message": "Event was recorded: " + body
          };
          callback(null, data);
        }
      });
    }
  };
  return eventsObj;

};
