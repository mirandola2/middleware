export interface Env {
	// If you set another name in wrangler.toml as the value for 'binding',
	// replace "DB" with the variable name you defined.
	DB: D1Database;
}

export default {
	async fetch(request: Request, env: Env) {
		// Check if this is a CORS preflight request
		if (request.method === 'OPTIONS') {
			return handleOptions(request)
		}

		const { pathname, searchParams } = new URL(request.url);

		const queryParams: { [key: string]: string } = {};
		for (const [key, value] of searchParams.entries()) {
			queryParams[key] = value;
		}

		const corsHeaders = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Just-A-PSK',
		};

		if (pathname === '/totem') {
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.DB.prepare('SELECT name, totem, location, year FROM totem order by year, name').all();
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		if (pathname === '/data') {
			const PRESHARED_AUTH_HEADER_KEY = "Just-A-PSK";
			const PRESHARED_AUTH_HEADER_VALUE = env.token_coca;
			const psk = request.headers.get(PRESHARED_AUTH_HEADER_KEY);

			const { createHash } = await import('node:crypto');

			  
			const hash = createHash('sha256');
			hash.update(PRESHARED_AUTH_HEADER_VALUE);
			

			console.log(request.headers)
			console.log(PRESHARED_AUTH_HEADER_VALUE)
			
			if (psk === hash.digest('hex')){
			// If you did not use `DB` as your binding name, change it here
			const { results } = await env.DB.prepare('SELECT full_name as name, member_code as code, birthday FROM data WHERE lower(name)=lower(?)').bind(decodeURIComponent(queryParams['name'])).all();
			return new Response(JSON.stringify(results), { headers: corsHeaders });
			}

			return new Response(JSON.stringify({}), { headers: corsHeaders, status: 403 });


		}

		if (pathname === '/birthday') {

			
			const currentYear = new Date().getFullYear();
			const isLeapYear = new Date(currentYear, 1, 29).getDate() === 29;
			const daysInYear = isLeapYear ? 366 : 365;
			  

			const dayRange = Number(queryParams["t"]) || 7
			var day = Number(queryParams["d"])
			if (Number.isNaN(day)){
				var now = new Date();
				var start = new Date(now.getFullYear(), 0, 0);
				var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
				var oneDay = 1000 * 60 * 60 * 24;
				day = Math.floor(diff / oneDay);
			}

			// Now use this Unix epoch in the SQL query
			const { results } = await env.DB.prepare(
				`SELECT SUBSTR(full_name, 1, INSTR(full_name, ' ') - 1) AS name,
						strftime('%d-%m', birthday) AS bd,
						strftime('%j', strftime('%Y-', 'now')||strftime('%m-%d', birthday)) AS jd,
						CASE 
							WHEN (strftime('%j', strftime('%Y-', 'now')||strftime('%m-%d', birthday)) - ?) < 0 
								THEN (strftime('%j', strftime('%Y-', 'now')||strftime('%m-%d', birthday)) - ? + ?)
							ELSE (strftime('%j', strftime('%Y-', 'now')||strftime('%m-%d', birthday)) - ?)
						END AS t_minus,
						strftime('%Y', 'now') - strftime('%Y', birthday) as age
				FROM data 
				WHERE t_minus BETWEEN 0 AND ?
				ORDER BY t_minus ASC, full_name;`
			).bind(day, day, daysInYear, day, dayRange).all();

									
			
			return new Response(JSON.stringify(results), { headers: corsHeaders });
		}

		return new Response(
			'Call /totem to retrieve all the totems. \nCall /data?name=XYZ to obtain the member code of the person whose full name corresponds to XYZ (uri encoded).\nCall /birthday?t=7&d=306 to get the names of the people that have a birthday in the `t` days following the day `d` and the days until that date (t-minus, `t` default 7, `d` default today - please be aware of timezones, must be a day of the year [1:366]).'
		);
	},
};

function handleOptions(request) {
	return new Response(null, {
	  status: 204,
	  headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 
		'Access-Control-Allow-Headers': 'Content-Type, Just-A-PSK',
		'Access-Control-Max-Age': '86400'
	  }
	})
  }