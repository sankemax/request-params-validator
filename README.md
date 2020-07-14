Please use minimal node version: 12.13.0

The schema registration endpoint:
1. Will receive a schema array. Schema ID will be generated out of each schema: the path and method.
2. Schema will be saved under an ID that represents the Schema-ID.
3. If the schema already exists, update the schema.

The schema validation endpoint:
1. Will receive a request data object.
2. Load the correct schema to validate against.
3. Schema validation: For each root (query_params, headers...):
	I. Create an empty array of errors.
	II. Load all required fields from the schema and check that they exist. If not => add error to array.
    III. *validators are used with or* Iterate over object along with the corresponding schema. For each inner value:
        Try to find the equivalent key in the schema (by "name"):
		    a. if exists: load all "types" from a map which key is the type and value is the validator function that validates the value. Apply the value on all validator functions. Each function returns either success or an error. If error => states reason.
Errors are appended to the error array.
         	b. if doesn't exist: add to errors array the type "invalid object key" (with path).
    IV. Make sure that empty schema parts (like empty body) are empty in the request object as well.
4. Return 200 OK with json... If abnormal fields exist, add the error array.

Design Considerations:
1. Database layer should be abstracted to an interface with (currently) an in-memory implementation of schema saving and loading..
2. All validator functions should have the same signature for composability.
3. Request validation endpoint receives an array of requests. This array can be validated asynchronously/in parallel.
4. Requests and their responses can be cached with a cache layer for some time (out of scope).
