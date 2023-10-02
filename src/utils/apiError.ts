/**
 * class for operational error handling (predictable errors)
 */

class apiError extends Error {
  public statusCode;
  public status;
  public operational;
  /**
   * @param message :string message
   * @param statusCode :number status code
   * @param operational :boolean is operational
   */
  constructor(
    message: string,
    statusCode: number,
    operational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";
    this.operational = operational;
  }
}

export default apiError;
