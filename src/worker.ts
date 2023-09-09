export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname } = new URL(request.url);

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': '*',
		};

		if (pathname === '/totem') {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.DB.prepare('SELECT name, totem, location, year FROM totem order by year, name').all();
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		if (pathname === '/data') {
			// If you did not use `DB` as your binding name, change it here
			const fiscal_code = getQueryParameters(new URL(request.url))['id']
			const { results } = await env.DB.prepare('SELECT member_code FROM data WHERE fiscal_code=?').bind(fiscal_code).all();
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		return new Response('Call /totem to retrieve all the totems. \nCall /data?id=XYZ to obtain the member code of the person whose fiscal code corresponds to XYZ.');
	},
};


function getQueryParameters(url: URL): { [key: string]: string } {
	const queryParams: { [key: string]: string } = {};
	for (const [key, value] of url.searchParams.entries()) {
	  queryParams[key] = value;
	}
	return queryParams;
  }