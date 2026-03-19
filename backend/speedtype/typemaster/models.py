from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class UserProfile(models.Model):
    """Extended user profile for typing test application"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"


class WordList(models.Model):
    """Different word lists for typing tests"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    words = models.JSONField()  # Store as list of words
    difficulty = models.CharField(
        max_length=20,
        choices=[('easy', 'Easy'), ('medium', 'Medium'), ('hard', 'Hard')],
        default='medium'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class TypingTestResult(models.Model):
    """Stores individual typing test results with performance metrics"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='typing_results')
    word_list = models.ForeignKey(WordList, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Test configuration
    duration_seconds = models.IntegerField(help_text="Duration of the test in seconds")
    test_mode = models.CharField(
        max_length=20,
        choices=[('time', 'Time'), ('words', 'Words')],
        default='time'
    )
    
    # Performance Metrics
    words_typed = models.IntegerField(default=0)
    correct_characters = models.IntegerField(default=0)
    incorrect_characters = models.IntegerField(default=0)
    total_characters_attempted = models.IntegerField(default=0)
    
    # Calculated metrics
    wpm = models.FloatField(help_text="Words Per Minute")  # (correct_words / duration_minutes)
    raw_wpm = models.FloatField(help_text="Raw WPM before accuracy penalty")
    accuracy = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Accuracy percentage"
    )
    
    # Time penalty system (the catch!)
    mistakes_count = models.IntegerField(default=0, help_text="Total mistakes made")
    time_penalty_seconds = models.FloatField(default=0, help_text="Total time deducted due to mistakes")
    adjusted_duration = models.FloatField(help_text="Duration after time penalties (in seconds)")
    
    # Test results
    passed = models.BooleanField(default=True)
    completed = models.BooleanField(default=True)
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['wpm']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.wpm:.2f} WPM ({self.accuracy:.1f}%)"
    
    def calculate_accuracy(self):
        """Calculate accuracy as a percentage"""
        if self.total_characters_attempted == 0:
            return 100.0
        return (self.correct_characters / self.total_characters_attempted) * 100
    
    def calculate_wpm(self, adjusted_time=False):
        """Calculate WPM. If adjusted_time=True, use adjusted_duration instead"""
        time_minutes = (self.adjusted_duration if adjusted_time else self.duration_seconds) / 60
        if time_minutes == 0:
            return 0
        # WPM = (correct_characters / 5) / time_in_minutes
        # Average word is 5 characters
        return (self.correct_characters / 5) / time_minutes


class UserStatistics(models.Model):
    """Aggregated statistics for users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='statistics')
    
    total_tests = models.IntegerField(default=0)
    best_wpm = models.FloatField(default=0)
    average_wpm = models.FloatField(default=0)
    best_accuracy = models.FloatField(default=0)
    average_accuracy = models.FloatField(default=0)
    
    total_typing_time = models.IntegerField(default=0, help_text="Total typing time in seconds")
    total_correct_characters = models.IntegerField(default=0)
    total_incorrect_characters = models.IntegerField(default=0)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Statistics"
