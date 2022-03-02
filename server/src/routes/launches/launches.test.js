// aici an invocat supertest ca sa putem avea acces la entry points

const request = require("supertest");
const app = require("../../app");


// ASTA E UN TEST 
describe("Test GET /launches", () => {
  test("I should respond 200 sucress", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
    // expect(response.statusCode).toBe(200);
  });
});



// ASTA E ALT TEST 
describe("Test POST /launches", () => {
  const completeLaunchDataTest = {
    mission: "USS Enterpripse",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
    launchDate: "January 4,2028",
  };

  const launchDataWithoutDate = {
    mission: "USS Enterpripse",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
  };

  const launchDataWithInvalidDate = {
    mission: "USS Enterpripse",
    rocket: "NCC 1701-D",
    target: "Kepler-186 f",
    launchDate: "zoot",
  };

  // https://jestjs.io/docs/expect - methode
  // .post(/directa)
  // .send(obiectul pe care dorim sa il trimitem)
  // .expect la ce te asepti sa iasa (asta e prin supertest)
  // expect din response e de la jest

  test("I should respond 201 sucress", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchDataTest)
      .expect("Content-Type", /json/)
      .expect(201);

    // verifica daca datele sunt asematoare deoarece le trasforma pe ambele si le compara folosind new Date and .valueOf()

    const requestDate = new Date(completeLaunchDataTest.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    // .toMatchObject - verifica daca sunt unele proprietati (dar nu exacte, poate fi doar una)
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });


  // TESTE PT ERRORI
  test("It should catch missing rq proprieties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    // aici este expected erroare care am scriso in controller la fel si statusCode
    expect(response.body).toStrictEqual({
      error: "Missing rq lunch property",
    });
  });
  test("It should catch invalid date", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    // aici este expected erroare care am scriso in controller la fel si statusCode
    expect(response.body).toStrictEqual({
      error: "Invalid date",
    });
  });
});
