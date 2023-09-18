import { type NeovimApi, type Params } from "./types.ts";

function toTypescriptType(params: Params) {
    const typesMap: Record<string, string> = {
        Array: "unknown[]",
        "ArrayOf(Buffer)": "number[]",
        "ArrayOf(Dictionary)": "Record<string, unknown>[]",
        "ArrayOf(Integer)": "number[]",
        "ArrayOf(Integer, 2)": "[number, number]",
        "ArrayOf(String)": "string[]",
        "ArrayOf(Tabpage)": "number[]",
        "ArrayOf(Window)": "number[]",
        Boolean: "boolean",
        Buffer: "number",
        Dictionary: "Record<string, unknown>",
        Float: "number",
        Integer: "number",
        LuaRef: "unknown",
        Object: "unknown",
        String: "string",
        Tabpage: "number",
        void: "void",
        Window: "number",
    };

    return params
        .map((param) => {
            const typescriptType: string | undefined = typesMap[param[0]];
            if (!typescriptType)
                throw Error(`typescriptType for type: ${param[0]} could not be termined`);
            return `${param[1]}: ${typescriptType}`;
        })
        .join(", ");
}

export function generateTypescriptContent(neovimApi: NeovimApi) {
    let output = `/* eslint @typescript-eslint/no-invalid-void-type: 0 */

/*
 * file generated by bunvim: https://github.com/gualcasas/bunvim
 */

export type NeovimApiInfo = {
  functions: {\n`;

    // start functions
    neovimApi.functions.forEach((fun) => {
        output += `    ${fun.name}: {
      parameters: [${toTypescriptType(fun.parameters)}];
      return_type: ${toTypescriptType(fun.return_type)};
    };
`;
    });

    output += "  };\n"; // end functions

    // start ui_events
    output += "  ui_events: {";

    neovimApi.ui_events.forEach((event) => {
        output += `    ${event.name}: { parameters: ${event.parameters} };`;
    });

    output += "\n}";

    return output;
}
