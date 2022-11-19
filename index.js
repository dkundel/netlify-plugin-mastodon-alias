import { writeFile, mkdir } from "node:fs/promises";

export const onBuild = async ({ inputs, constants, netlifyConfig }) => {
  const { username, instance, strictUsername } = inputs;

  if (strictUsername) {
    const functionPath = "/.well-known/webfinger";
    const edgeFileName = "webfinger";
    const edgeDirectory =
      constants.EDGE_FUNCTIONS_SRC || constants.INTERNAL_EDGE_FUNCTIONS_SRC;
    const location = `${edgeDirectory}/${edgeFileName}.js`;
    const edgeFunction = `
export default async (request, context) => {
  const incomingRequest = new URL(request.url);
  const resource = incomingRequest.searchParams.get("resource");
  if (typeof resource === 'string' && (resource || "").startsWith("acct:${strictUsername}@")) {
    const url = new URL(
      "https://${instance}/.well-known/webfinger?resource=acct:${username}@${instance}"
    );
    return Response.redirect(url, 302);
  } else {
    return new Response("Not found", { status: 404 });
  }
};    
    `;
    await mkdir(edgeDirectory, { recursive: true });
    await writeFile(location, edgeFunction, "utf-8");

    // Add edge functions
    netlifyConfig.edge_functions
      ? netlifyConfig.edge_functions.push({
          path: functionPath,
          function: edgeFileName,
        })
      : (netlifyConfig.edge_functions = [
          { path: functionPath, function: edgeFileName },
        ]);
  } else {
    const urlOfWebFinger = `https://${instance}/.well-known/webfinger?resource=acct:${username}@${instance}`;
    netlifyConfig.redirects.push({
      from: "/.well-known/webfinger",
      to: urlOfWebFinger,
    });
  }
};
