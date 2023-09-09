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
			const fiscal_code = queryParams['id'];
			const { results } = await env.DB.prepare('SELECT member_code FROM data WHERE fiscal_code=?').bind(fiscal_code).all();
			var listOfCodes: String[] = [];
			results.forEach((element) => {
				listOfCodes.push(String(element?.member_code));
			});
			return new Response(JSON.stringify(listOfCodes), { headers: corsHeaders });
		}

		if (pathname === '/birthday') {
			// If you did not use `DB` as your binding name, change it here

			const { results } = await env.DB.prepare(
				"SELECT full_name as name, strftime('%j', birthday) - strftime('%j', 'now', 'localtime') AS t_minus FROM data WHERE strftime('%m-%d', birthday) >= strftime('%m-%d', 'now', 'localtime' ) AND strftime('%m-%d', birthday) <= strftime('%m-%d', 'now', 'localtime', '+7 days') ORDER BY strftime('%m-%d', birthday) ASC, full_name;"
			).all();

			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		return new Response(
			'Call /totem to retrieve all the totems. \nCall /data?id=XYZ to obtain the member code of the person whose fiscal code corresponds to XYZ.\nCall /birthday to get the names of the people that have a birthday in the current week and the days until that date (t-minus).'
		);
	},
};
