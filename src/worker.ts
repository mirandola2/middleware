export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		const { pathname, searchParams } = new URL(request.url);

		const queryParams: { [key: string]: string } = {};
		for (const [key, value] of searchParams.entries()) {
			queryParams[key] = value;
		}

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
			const { results } = await env.DB.prepare('SELECT full_name as name, member_code as code, birthday FROM data WHERE lower(name)=lower(?)').bind(decodeURIComponent(queryParams['name'])).all();
			
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		if (pathname === '/birthday') {
			// If you did not use `DB` as your binding name, change it here

			const dayRange = Number(queryParams["t"]) || 7
			const { results } = await env.DB.prepare(
				`SELECT full_name as name,
					strftime('%m-%d', birthday, 'localtime') as bd,
					CASE 
						WHEN (strftime('%j', birthday, 'localtime') - strftime('%j', 'now', 'localtime')) < 0 
						THEN (strftime('%j', birthday, 'localtime') - strftime('%j', 'now', 'localtime')) + 365
						ELSE (strftime('%j', birthday, 'localtime') - strftime('%j', 'now', 'localtime'))
					END AS t_minus 
				FROM data 
				WHERE t_minus BETWEEN 0 AND ?
				ORDER BY t_minus ASC, full_name;`
			).bind(dayRange).all();
						
			
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		return new Response(
			'Call /totem to retrieve all the totems. \nCall /data?name=XYZ to obtain the member code of the person whose full name corresponds to XYZ (uri encoded).\nCall /birthday?t=7 to get the names of the people that have a birthday in the current week and the days until that date (t-minus, default 7).'
		);
	},
};
