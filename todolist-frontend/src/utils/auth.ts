type StatusCode = number | undefined;
export function getErrorMessageByStatusCode(statusCode: StatusCode) {
   switch (statusCode) {
      case 400:
         return "Invalid credentials";

      case 404:
         return "User with provided email was not found";
      case 409:
         return "Email already taken";
      default:
         return "Something went wrong, try again later.";
   }
}
