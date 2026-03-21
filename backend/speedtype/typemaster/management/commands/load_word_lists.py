from django.core.management.base import BaseCommand
from typemaster.models import WordList


class Command(BaseCommand):
    help = 'Load sample word lists for testing'
    
    def handle(self, *args, **options):
        # Sentences split into words arrays
        word_lists = [
            {
                'name': 'Easy Paragraph 1',
                'description': 'A simple sentence about a fox',
                'difficulty': 'easy',
                'words': "The quick brown fox jumps over the lazy dog.".split()
            },
            {
                'name': 'Easy Paragraph 2',
                'description': 'A simple sentence about weather',
                'difficulty': 'easy',
                'words': "It was a bright cold day in April, and the clocks were striking thirteen.".split()
            },
            {
                'name': 'Medium Paragraph 1',
                'description': 'A paragraph about programming',
                'difficulty': 'medium',
                'words': "Programming is the art of writing instructions for computers. It requires logical thinking, creativity, and patience. Many people find it to be a rewarding career path because building software can solve complex real-world problems.".split()
            },
            {
                'name': 'Medium Paragraph 2',
                'description': 'A paragraph from literature',
                'difficulty': 'medium',
                'words': "All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.".split()
            },
            {
                'name': 'Hard Paragraph 1',
                'description': 'A complex technical explanation',
                'difficulty': 'hard',
                'words': "In software engineering, asynchronous programming allows non-blocking execution of computational tasks. This architecture minimizes latency and maximizes throughput, particularly in heavily concurrent microservices environments where network overhead and distributed data consistency become significant bottlenecks.".split()
            },
            {
                'name': 'Hard Paragraph 2',
                'description': 'An advanced scientific paragraph',
                'difficulty': 'hard',
                'words': "Quantum mechanics represents a fundamental shift from classical physics, proposing that energy, momentum, and other quantities of a bound system are restricted to discrete values. The wave-particle duality and uncertainty principle fundamentally characterize these phenomena at microscopic scales.".split()
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
