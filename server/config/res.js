/**
 * Send content of response that has a default success status code of 200 
 * @param {*} response content of response that has a default success status code of 200 
 */
function send200(response) {
  return {
    error: null,
    statusCode: 200,
    response: response,
  };
}

/**
 * Send content of response that has a default failure status code of 400
 * @param {*} response content of response that has a default failure status code of 400
 */
function send400(message) {
  return {
    error: message,
    statusCode: 400,
    response: null,
  };
}

module.exports = {
  /**
   * Send success response with status code and response
   *  200 - OK
      201 - Created
      203 - Non-authoritative information
      204 - No content
      205 - Reset content
      206 - Partial content
   */
  sendSuccess: (statusCode, response) => {
    if (typeof response === "undefined") {
      const res = statusCode;
      return send200(res);
    } else {
      return {
        error: null,
        statusCode: statusCode,
        response: response,
      };
    }
  },
  /**
   * Send success response with status code and response
   *  400 - Bad Request
      401 - Unauthorized
      402 - Payment Required
      403 - Forbidden
      404 - Not Found
      405 - Method Not Allowed
      406 - Not Acceptable
      407 - Authentication Required
      408 - Request Timeout
      409 - Conflict
      410 - Gone
      411 - Length Required
      412 - Precondition Failed
      413 - Payload Too Large
      414 - URI Too Long
      415 - Unsupported Media Type
      417 - Expectation Failed
      429 - Too Many Requests
      451 - Unavailable For Legal Reason
      499 - Client Close Request
   */
  sendFailure: (statusCode, message) => {
    if (typeof message === "undefined") {
      const mes = statusCode;
      return send400(mes);
    } else {
      return {
        error: message,
        statusCode: statusCode,
        response: null,
      };
    }
  },
};
