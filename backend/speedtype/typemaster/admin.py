from django.contrib import admin
from .models import (
    UserProfile,
    WordList,
    TypingTestResult,
    UserStatistics,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(WordList)
class WordListAdmin(admin.ModelAdmin):
    list_display = ['name', 'difficulty', 'created_at']
    list_filter = ['difficulty', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(TypingTestResult)
class TypingTestResultAdmin(admin.ModelAdmin):
    list_display = ['user', 'wpm', 'accuracy', 'mistakes_count', 'created_at']
    list_filter = ['test_mode', 'passed', 'completed', 'created_at']
    search_fields = ['user__username']
    readonly_fields = ['created_at', 'updated_at', 'user']
    
    fieldsets = (
        ('User Info', {
            'fields': ('user', 'word_list')
        }),
        ('Test Configuration', {
            'fields': ('duration_seconds', 'test_mode')
        }),
        ('Performance Metrics', {
            'fields': (
                'words_typed',
                'correct_characters',
                'incorrect_characters',
                'total_characters_attempted',
                'wpm',
                'raw_wpm',
                'accuracy',
            )
        }),
        ('Time Penalty System', {
            'fields': (
                'mistakes_count',
                'time_penalty_seconds',
                'adjusted_duration',
            )
        }),
        ('Results', {
            'fields': ('passed', 'completed', 'notes')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(UserStatistics)
class UserStatisticsAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_tests', 'best_wpm', 'average_wpm', 'best_accuracy']
    search_fields = ['user__username']
    readonly_fields = ['updated_at', 'user']
