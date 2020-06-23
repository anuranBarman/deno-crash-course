const encoder = new TextEncoder();
const greetText = encoder.encode("Hello World\nDeno is Awesome!!");
await Deno.writeFile("greet.txt", greetText);
