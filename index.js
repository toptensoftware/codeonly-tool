#!/usr/bin/env node
import path from 'node:path';
import url from 'node:url';
import fs from "node:fs";
import { globSync } from "glob";

// Get dirname
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Parse arguments and return a template to process
async function parseArgs(args)
{
    let files = [];
    // Check command line args
    for (let i=0; i<args.length; i++)
    {
        var a = args[i];

        if (a.startsWith("--"))
        {
            isSwitch = true;
            a = a.substring(2);

            var parts = a.split(':');
            switch (parts[0])
            {
                default:
                    throw new Error(`Unknown command line arg: ${args[i]}`);
            }
        }
        else
        {
            files.push(...globSync(args[i]));
        }
    }

    return files;
}

// Parse args
let files = await parseArgs(process.argv.slice(2));

for (let f of files)
{
    let src = fs.readFileSync(f, "utf8");
    // C style comments
    src = src.replace(/\*[^*]*\*+(?:[^/*][^*]*\*+)*/gm, "");

    // C++ style comments
    src = src.replace(/\/\/.*/gm, "");

    // Blank lines
    src = src.replace(/^\s*\n/gm, "\n");

    // Write file
    fs.writeFileSync(f, src, "utf8");
}

