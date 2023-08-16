export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
  }
  
  export default {
	async fetch(request: Request, env: Env) {
	  const { pathname } = new URL(request.url);
  
	  if (pathname === "/totem") {
		// If you did not use `DB` as your binding name, change it here
		const { results } = await env.DB.prepare(
		  "SELECT * FROM totem"
		)
		  .all();
		return Response.json(results);
	  }
  
	  return new Response(
		"Call /totem to get all the totems"
	  );
	},
  };