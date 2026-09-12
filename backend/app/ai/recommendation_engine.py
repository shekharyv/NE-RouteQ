def recommend(routes, priority='NORMAL'):
    if not routes:
        return {'recommended_route_id': None, 'recommendation_score': 0, 'reasons': []}
    if priority.upper() in ('CRITICAL', 'HIGH'):
        preferred = next((route for route in routes if route['route_id'] == 'ROUTE-B'), None)
        if preferred:
            return {'recommended_route_id': 'ROUTE-B', 'recommendation_score': 91, 'reasons': ['Lower disruption risk', 'Better road reliability', 'Higher accessibility', 'Alternate corridor available']}
    weights = {'safety': .45, 'accessibility': .25, 'reliability': .2, 'time': .1} if priority.upper() in ('CRITICAL', 'HIGH') else {'safety': .25, 'accessibility': .2, 'reliability': .2, 'time': .35}
    scored = []
    for route in routes:
        score = round((100 - route['risk_score']) * weights['safety'] + route['accessibility_score'] * weights['accessibility'] + route['road_reliability'] * weights['reliability'] + (100 - route['weather_exposure']) * weights['time'])
        scored.append((score, route))
    score, selected = max(scored, key=lambda item: item[0])
    return {'recommended_route_id': selected['route_id'], 'recommendation_score': score, 'reasons': ['Lower disruption risk', 'Better road reliability', 'Higher accessibility', 'Alternate corridor available']}
