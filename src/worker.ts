export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
  }
  
  export default {
	async fetch(request: Request, env: Env) {
	  const { pathname } = new URL(request.url);

	  const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
		"Access-Control-Allow-Headers": "*",
	  }
	  
  
	  if (pathname === "/totem") {
		// If you did not use `DB` as your binding name, change it here
		const { results } = await env.DB.prepare(
		  "SELECT name, totem, location, year FROM totem order by year, name"
		)
		  .all();
		return new Response(JSON.stringify(results), {headers: corsHeaders})
		
		
	  }
  
	  return new Response(
		"Call /totem to get all the totems"
	  );
	},
  };









  