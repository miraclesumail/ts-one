interface Person {
    name: string;
    age: number;
    noob: boolean;
}

interface Extra {
    subject: string
}

type SuperMan = {
    [P in keyof Person]: Person[P];  
} & Extra

const var1: SuperMan = {
    name: 'test1',
    age: 18,
    noob: false,
    subject: 'math',
}

type aa = 'subject' | 'age';

type Picked<T, K extends keyof T> = {
    [P in K]: T[P]
}

type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"

type PickedMan = Picked<SuperMan, Exclude<keyof SuperMan, 'subject'>>

const var2: PickedMan = {
      age: 18,
      name: 'sds',
      noob: true,
}

function speak(person: PickedMan): string {
     return `${person.age} 我屋二月`;
}

