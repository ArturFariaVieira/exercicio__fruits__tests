import fruitsRepository, { Fruit } from "../repositories/fruits-repository";

export type FruitInput = Omit<Fruit, "id">;

function getFruits() {
  return fruitsRepository.getFruits();
}

function getSpecificFruit(id: number) {
  console.log(id)
  if (!id) {
    throw {message: "no Id provided"}
  }
  const fruit = fruitsRepository.getSpecificFruit(id);
  if (!fruit) {
    throw { message: "Fruit not found." }
  }

  return fruit;
}

function createFruit(fruit: FruitInput): void {
  const fruitAlreadyRegistered = fruitsRepository.getSpecificFruitByName(fruit.name);
  if (fruitAlreadyRegistered) {
    throw { message: "This fruit already exists!" }
  }

  fruitsRepository.insertFruit(fruit);
}

const fruitsService = {
  getFruits,
  getSpecificFruit,
  createFruit
}

export default fruitsService;