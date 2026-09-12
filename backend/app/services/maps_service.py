from ..core.config import GOOGLE_MAPS_API_KEY


def route_geometry(source: str, destination: str):
    # Real Google Directions integration can be enabled without changing callers.
    demo = {('Guwahati', 'Imphal'): [[91.7362, 26.1158], [92.684, 26.348], [93.7266, 25.9089], [93.9368, 24.817]], ('Silchar', 'Aizawl'): [[92.7789, 24.8333], [92.678, 24.225], [92.7176, 23.7307]]}
    return demo.get((source, destination), [[91.7362, 26.1158], [92.7, 25.5], [93.9368, 24.817]])


def maps_mode():
    return 'google' if GOOGLE_MAPS_API_KEY else 'demo'
