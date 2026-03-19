from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    UserProfile, 
    WordList, 
    TypingTestResult, 
    UserStatistics
)


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class WordListSerializer(serializers.ModelSerializer):
    """Serializer for WordList model"""
    class Meta:
        model = WordList
        fields = ['id', 'name', 'description', 'words', 'difficulty', 'created_at']
        read_only_fields = ['id', 'created_at']


class TypingTestResultSerializer(serializers.ModelSerializer):
    """Serializer for TypingTestResult model"""
    username = serializers.CharField(source='user.username', read_only=True)
    word_list_name = serializers.CharField(source='word_list.name', read_only=True)
    
    class Meta:
        model = TypingTestResult
        fields = [
            'id',
            'user',
            'username',
            'word_list',
            'word_list_name',
            'duration_seconds',
            'test_mode',
            'words_typed',
            'correct_characters',
            'incorrect_characters',
            'total_characters_attempted',
            'wpm',
            'raw_wpm',
            'accuracy',
            'mistakes_count',
            'time_penalty_seconds',
            'adjusted_duration',
            'passed',
            'completed',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'wpm', 'raw_wpm', 'created_at', 'updated_at']


class TypingTestResultCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating TypingTestResult"""
    class Meta:
        model = TypingTestResult
        fields = [
            'word_list',
            'duration_seconds',
            'test_mode',
            'words_typed',
            'correct_characters',
            'incorrect_characters',
            'total_characters_attempted',
            'wpm',
            'raw_wpm',
            'accuracy',
            'mistakes_count',
            'time_penalty_seconds',
            'adjusted_duration',
            'passed',
            'completed',
            'notes',
        ]


class UserStatisticsSerializer(serializers.ModelSerializer):
    """Serializer for UserStatistics model"""
    username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UserStatistics
        fields = [
            'id',
            'user',
            'username',
            'total_tests',
            'best_wpm',
            'average_wpm',
            'best_accuracy',
            'average_accuracy',
            'total_typing_time',
            'total_correct_characters',
            'total_incorrect_characters',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'updated_at']


class LeaderboardSerializer(serializers.Serializer):
    """Serializer for leaderboard data"""
    rank = serializers.IntegerField()
    username = serializers.CharField()
    best_wpm = serializers.FloatField()
    average_wpm = serializers.FloatField()
    best_accuracy = serializers.FloatField()
    total_tests = serializers.IntegerField()


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        read_only_fields = ['id']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
