from django.apps import AppConfig


class TypemasterConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'typemaster'
    
    def ready(self):
        import typemaster.signals
