const LANGUAGE_MAP = {
  js: [
    "javascript",
    `// Welcome to IDEas — where JavaScript dreams compile!
const idea = "brilliant";

const bringItToLife = (concept) => {
  if (concept === "brilliant") {
    console.log("Your IDEas are running.");
  }
};

bringItToLife(idea);`,
  ],

  ts: [
    "typescript",
    `// IDEas loves TypeScript — type-safe brilliance awaits!
interface Idea {
  title: string;
  brilliant: boolean;
}

const myIdea: Idea = {
  title: "Build something amazing",
  brilliant: true,
};

console.log(\`IDEas: \${myIdea.title}\`);`,
  ],

  py: [
    "python",
    `# IDEas — where Python meets creativity!

def bring_idea_to_life(concept: str) -> str:
    return f"IDEas is running your {concept}!"

if __name__ == "__main__":
    print(bring_idea_to_life("Python script"))`,
  ],

  java: [
    "java",
    `// IDEas — Compile your thoughts in Java!
public class IDEas {
    public static void main(String[] args) {
        String idea = "Build something incredible";
        System.out.println("IDEas: " + idea);
    }
}`,
  ],

  cpp: [
    "cpp",
    `// IDEas — C++ Edition. Maximum power, zero limits.
#include <iostream>
#include <string>

int main() {
    std::string idea = "IDEas";
    std::cout << "Welcome to " << idea << "! Start building." << std::endl;
    return 0;
}`,
  ],

  c: [
    "c",
    `/* IDEas — C Edition. Close to the metal, close to genius. */
#include <stdio.h>

int main() {
    printf("Welcome to IDEas — where C developers thrive!\\n");
    return 0;
}`,
  ],

  cs: [
    "csharp",
    `// IDEas — C# Edition. Elegant code, powerful ideas.
using System;

class IDEas {
    static void Main(string[] args) {
        Console.WriteLine("Welcome to IDEas — Start building with C#!");
    }
}`,
  ],

  go: [
    "go",
    `// IDEas — Go Edition. Concurrent. Simple. Brilliant.
package main

import "fmt"

func main() {
    idea := "something brilliant"
    fmt.Printf("IDEas: Building %s in Go!\\n", idea)
}`,
  ],

  rs: [
    "rust",
    `// IDEas — Rust Edition. Safe code, fearless creativity.
fn main() {
    let idea = String::from("fearless Rust code");
    println!("IDEas is compiling your {}!", idea);
}`,
  ],

  rb: [
    "ruby",
    `# IDEas — Ruby Edition. Where elegance meets power.

def bring_idea_to_life(concept)
  puts "IDEas: #{concept} is coming to life!"
end

bring_idea_to_life("Your Ruby masterpiece")`,
  ],

  php: [
    "php",
    `<?php
// IDEas — PHP Edition. Server-side ideas, unlimited potential.

function bringIdeaToLife(string $concept): void {
    echo "IDEas: {$concept} is live on the server!\\n";
}

bringIdeaToLife("Your PHP project");
?>`,
  ],

  swift: [
    "swift",
    `// IDEas — Swift Edition. Fast code, bright ideas.
import Foundation

func bringIdeaToLife(_ concept: String) {
    print("IDEas: Building \\(concept) at full speed!")
}

bringIdeaToLife("your Swift app")`,
  ],

  kt: [
    "kotlin",
    `// IDEas — Kotlin Edition. Concise. Expressive. Brilliant.
fun main() {
    val idea = "something amazing"
    println("IDEas: Your Kotlin code is building $idea!")
}`,
  ],

  r: [
    "r",
    `# IDEas — R Edition. Where data meets discovery.

bring_idea_to_life <- function(concept) {
  cat(paste("IDEas:", concept, "is ready to analyze!\\n"))
}

bring_idea_to_life("Your R script")`,
  ],

  scala: [
    "scala",
    `// IDEas — Scala Edition. Functional. Object-oriented. Brilliant.
object IDEas extends App {
  val idea = "scalable masterpiece"
  println(s"IDEas: Building your $idea!")
}`,
  ],

  sh: [
    "shell",
    `#!/bin/bash
# IDEas — Shell Edition. Automate everything, limit nothing.

IDEA="shell automation"
echo "IDEas: Your $IDEA script is running!"
echo "Happy hacking from IDEas 🚀"`,
  ],

  sql: [
    "sql",
    `-- IDEas — SQL Edition. Query your way to brilliance.

SELECT 
    'IDEas' AS platform,
    'Welcome, Data Developer!' AS message,
    NOW() AS started_at;

-- Write your queries below`,
  ],

  html: [
    "html",
    `<!DOCTYPE html>
<!-- IDEas — HTML Edition. Structure your ideas beautifully. -->
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>IDEas — My Project</title>
</head>
<body>
  <h1>Welcome to IDEas 💡</h1>
  <p>Start building something the world hasn't seen yet.</p>
</body>
</html>`,
  ],

  css: [
    "css",
    `/* IDEas — CSS Edition. Style your ideas into reality. */

:root {
  --ideas-purple: #7c3aed;
  --ideas-white: #f9fafb;
}

body {
  font-family: sans-serif;
  background: var(--ideas-white);
  color: var(--ideas-purple);
}

h1::before {
  content: "💡 ";
}`,
  ],

  json: [
    "json",
    `{
  "platform": "IDEas",
  "tagline": "Where ideas compile into reality",
  "version": "1.0.0",
  "features": ["Monaco Editor", "Live Terminal", "Multi-language"],
  "author": "You"
}`,
  ],

  yaml: [
    "yaml",
    `# IDEas — YAML Edition. Configure your ideas clearly.

platform: IDEas
tagline: "Where ideas compile into reality"
version: "1.0.0"
features:
  - Monaco Editor
  - Live Terminal
  - Multi-language support
author: You`,
  ],

  md: [
    "markdown",
    `# 💡 Welcome to IDEas

> Where ideas compile into reality.

## Getting Started

1. Pick your language
2. Write your code
3. Run and iterate

## About IDEas

IDEas is a browser-based IDE that turns your ideas into working software — instantly.`,
  ],

  lua: [
    "lua",
    `-- IDEas — Lua Edition. Lightweight scripts, heavyweight ideas.

local function bringIdeaToLife(concept)
  print("IDEas: " .. concept .. " is running!")
end

bringIdeaToLife("Your Lua script")`,
  ],

  dart: [
    "dart",
    `// IDEas — Dart Edition. Flutter-ready, future-proof.
void main() {
  final idea = "cross-platform app";
  print("IDEas: Building your $idea with Dart!");
}`,
  ],

  pl: [
    "perl",
    `#!/usr/bin/perl
# IDEas — Perl Edition. Text processing, redefined.
use strict;
use warnings;

my $idea = "Perl masterpiece";
print "IDEas: Your $idea is running!\\n";`,
  ],

  ex: [
    "elixir",
    `# IDEas — Elixir Edition. Concurrent. Fault-tolerant. Brilliant.
defmodule IDEas do
  def start do
    IO.puts("IDEas: Your Elixir code is alive and concurrent!")
  end
end

IDEas.start()`,
  ],

  hs: [
    "haskell",
    `-- IDEas — Haskell Edition. Pure functions, impure excitement.
module Main where

main :: IO ()
main = do
  let idea = "functional masterpiece"
  putStrLn $ "IDEas: Compiling your " ++ idea ++ "!"`,
  ],

  xml: [
    "xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!-- IDEas — XML Edition. Structure meets meaning. -->
<ideas>
  <platform>IDEas</platform>
  <tagline>Where ideas compile into reality</tagline>
  <project>
    <name>My Project</name>
    <status>In Progress</status>
  </project>
</ideas>`,
  ],
};
export default function getLanguageConfig(extension){
    return LANGUAGE_MAP[extension] ?? ["plaintext", "// Start coding..."];
}