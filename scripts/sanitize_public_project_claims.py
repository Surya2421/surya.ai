from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
verified_github = {
    'langgraph-search-agent': 'https://github.com/Surya2421/langgraph-search-agent',
    'ai-birthday-wisher': 'https://github.com/Surya2421/ai-birthday-wisher',
}

for file in sorted((root / 'data' / 'projects').glob('*.json')):
    project = json.loads(file.read_text(encoding='utf-8'))
    slug = project['slug']
    links = project.get('links', {})
    project['links'] = {
        'github': verified_github.get(slug, ''),
        'live': '',
        'caseStudy': '',
        'demo': links.get('demo', '') if str(links.get('demo', '')).startswith('https://www.youtube.com/') else '',
    }
    project.pop('metrics', None)
    project['lessonsLearned'] = [lesson for lesson in project.get('lessonsLearned', []) if '%' not in lesson]
    video = project.get('demoVideo') or {}
    sources = [video.get('mp4'), video.get('webm')]
    has_source = any(source and (str(source).startswith('http') or (root / 'public' / str(source).lstrip('/')).exists()) for source in sources)
    if not has_source:
        project.pop('demoVideo', None)
    file.write_text(json.dumps(project, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')

print('Removed unverified metrics and dead project destinations.')
