def calculate_accessibility(*, road_connectivity=91, terrain=78, infrastructure=84, weather=88, alternate_routes=92):
    values = {'road_connectivity': road_connectivity, 'terrain': terrain, 'infrastructure': infrastructure, 'weather': weather, 'alternate_routes': alternate_routes}
    score = round(sum(values.values()) / len(values))
    level = 'EXCELLENT' if score >= 90 else 'GOOD' if score >= 75 else 'MODERATE' if score >= 55 else 'AT RISK'
    return {'score': score, 'level': level, 'breakdown': values}
