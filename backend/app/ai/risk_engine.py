def analyze_risk(*, weather=15, road=10, terrain=8, traffic=5, disruption=7):
    score = max(0, min(100, round(weather * .25 + road * .25 + terrain * .2 + traffic * .1 + disruption * .2)))
    level = 'LOW' if score < 30 else 'MODERATE' if score < 55 else 'HIGH' if score < 80 else 'CRITICAL'
    factors = []
    if weather >= 20: factors.append('Weather exposure')
    if terrain >= 15: factors.append('Difficult terrain')
    if disruption >= 15: factors.append('Disruption risk')
    return {'risk_score': score, 'risk_level': level, 'risk_factors': factors or ['Stable operating conditions'], 'confidence': 0.82}
