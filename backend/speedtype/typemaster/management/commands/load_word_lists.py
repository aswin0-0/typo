from django.core.management.base import BaseCommand
from typemaster.models import WordList


class Command(BaseCommand):
    help = 'Load sample word lists for testing'
    
    def handle(self, *args, **options):
        # Sample word lists
        word_lists = [
            {
                'name': 'Common English Words - Easy',
                'description': 'Basic everyday English words',
                'difficulty': 'easy',
                'words': [
                    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
                    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
                    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
                    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
                    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me'
                ]
            },
            {
                'name': 'Intermediate Vocabulary',
                'description': 'Moderate difficulty English words',
                'difficulty': 'medium',
                'words': [
                    'programming', 'computer', 'technology', 'development', 'interface', 
                    'database', 'network', 'security', 'application', 'algorithm',
                    'framework', 'library', 'function', 'variable', 'constant',
                    'debugging', 'testing', 'deployment', 'documentation', 'repository',
                    'performance', 'optimization', 'implementation', 'architecture', 'scalability',
                    'communication', 'collaboration', 'innovation', 'integration', 'automation',
                    'maintenance', 'debugging', 'refactoring', 'compatibility', 'reliability',
                    'availability', 'security', 'encryption', 'authentication', 'authorization',
                    'configuration', 'environment', 'template', 'protocol', 'specification'
                ]
            },
            {
                'name': 'Advanced Technical Terms',
                'description': 'Complex programming and technical terminology',
                'difficulty': 'hard',
                'words': [
                    'microservices', 'containerization', 'orchestration', 'virtualization',
                    'asynchronous', 'synchronization', 'concurrency', 'parallelization',
                    'polymorphism', 'encapsulation', 'inheritance', 'abstraction',
                    'authentication', 'authorization', 'encryption', 'cryptography',
                    'deserialization', 'serialization', 'marshalling', 'unmarshalling',
                    'idempotency', 'immutability', 'consistency', 'availability',
                    'latency', 'throughput', 'bandwidth', 'jitter',
                    'normalization', 'denormalization', 'sharding', 'replication',
                    'compilation', 'interpretation', 'transpilation', 'instrumentation',
                    'agile', 'scrum', 'sprint', 'retrospective', 'refactoring', 'deprecation'
                ]
            },
            {
                'name': 'Programming Languages',
                'description': 'Popular programming language names',
                'difficulty': 'medium',
                'words': [
                    'python', 'javascript', 'java', 'csharp', 'cplusplus', 'ruby',
                    'php', 'golang', 'rust', 'kotlin', 'swift', 'objective', 'perl',
                    'scala', 'haskell', 'clojure', 'elixir', 'erlang', 'lua',
                    'typescript', 'coffeescript', 'dart', 'groovy', 'r', 'matlab',
                    'fortran', 'assembly', 'basic', 'pascal', 'ada', 'cobol'
                ]
            },
        ]
        
        created_count = 0
        for wl in word_lists:
            obj, created = WordList.objects.get_or_create(
                name=wl['name'],
                defaults={
                    'description': wl['description'],
                    'difficulty': wl['difficulty'],
                    'words': wl['words']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created word list: {obj.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Word list already exists: {obj.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'\nTotal word lists created: {created_count}')
        )
