// const mocha = require("mocha");
// const assert = require("assert");
// const sut = require("./../components/jwt-utils");

// const stubJwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImJiNTUxNzQyLWYyYjktNDE1NS04NDIzLTMwZDk4N2NmZjAyZiIsImlhdCI6MTU1NDEwOTM5NCwiZXhwIjoxNTU0MTEzMTAwfQ.-iZroZHWgjxqS_fvAgkgglXE3u07iMzknlt-g9wjIB0";

// describe("jwt utils", function() {

//     describe("parsing a jwt", function () {

//         it("returns expected name", function() {
//             const { name } = sut(stubJwt);
//             assert.equal("John Doe", name, "Unexpected name from parsed JWT");
//         });

//         it("returns expected expiration date when available", function() {
//             const { exp:expirationAsUnixTimestamp } = sut(stubJwt);
//             const actual = expirationAsUnixTimestamp;
//             const expected = Date.UTC(2019, 4-1, 1, 10, 5, 0)/1000;

//             assert.equal(expected, actual, `Expected ${new Date(expected*1000).toISOString()} but got ${new Date(actual*1000).toISOString()}`);
//         });

//         it("returns expected expiration date when NOT available", function() {
//             const jwtWithoutExpirationDate = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImJiNTUxNzQyLWYyYjktNDE1NS04NDIzLTMwZDk4N2NmZjAyZiIsImlhdCI6MTU1NDEwOTM5NH0.lqouZU34ezV34SIJ9NsUh6GjNdh_1p7GBfVWSUXIz9I";
//             const { exp:expirationAsUnixTimestamp } = sut(jwtWithoutExpirationDate);
            
//             // guard assert
//             assert.equal(expirationAsUnixTimestamp, null, "Expected null as expiration date");
//         });

//     });

// });