import app from "index";
import supertest from "supertest";
import { Fruit } from "repositories/fruits-repository";

const api = supertest(app)
describe("Fruits test", () => {
    it("should list fruits when get /fruits", async () => {
        const fruits = await api.get("/fruits");

        expect(fruits.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })])
        )
    })

    it("should return a specific fruit when get /fruits/:id", async () => {
        const fruits = await api.get("/fruits");
        let randomid = -50;
        const arrayids = [];
        fruits.body.forEach((value: Fruit) => arrayids.push(value.id))
        while (!arrayids.includes(randomid)) {
            randomid = Math.ceil((Math.random() * 100))
        }

        const fruit = await api.get(`/fruits/${randomid}`);
        expect(fruit.body).toEqual(
            expect.objectContaining({
                name: fruit.body.name,
                price: fruit.body.price
            }))
    })
    it("should respond with status 404 if no matching id", async () => {
        const fruits = await api.get("/fruits");
        let randomid = fruits.body[0].id;
        const arrayids = [];
        fruits.body.forEach((value: Fruit) => arrayids.push(value.id))
        while (arrayids.includes(randomid)) {
            randomid = Math.ceil((Math.random() * 10000))
        }

        const fruit = await api.get(`/fruits/${randomid}`);
        expect(fruit.status).toEqual(404)
    })

    it("should respond with status 422 if invalid body", async () => {
        const wrongbody = {
            name: "josias",
            color: "amarelo"
        };
        const result = await api.post("/fruits").send(wrongbody);
        expect(result.status).toEqual(422);
    })

    it("should respond with status 409 if fruit already exists", async () => {
        const fruits = await api.get("/fruits");
        const newoldfruit = {
            name: fruits.body[0].name,
            price: fruits.body[0].price + 50
        }
        const result = await api.post("/fruits").send(newoldfruit)
        expect(result.status).toEqual(409)
    })

    it("should responde with 201 when new fruit is created ", async () => {
        const result = await api.post("/fruits").send({
            name: "not a fruit, just a test",
            price: 66669420
        })
        expect(result.status).toEqual(201)
    })
})
