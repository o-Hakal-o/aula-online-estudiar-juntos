# temp_fix_email.py

from tasks.models import CustomUser
from collections import Counter

print("--- Starting email data cleanup ---")

# 1. Find all duplicate emails (including the empty string '')
emails = CustomUser.objects.values_list('email', flat=True)
duplicates = [email for email, count in Counter(emails).items() if count > 1]

if not duplicates:
    print("No duplicates found. Safe to migrate.")
else:
    print(f"Found duplicate emails: {duplicates}")

    # 2. Loop through duplicates and fix them
    for email_to_fix in duplicates:
        # Get all users with the duplicate email, ordered by primary key (pk)
        users = CustomUser.objects.filter(email=email_to_fix).order_by('pk')
        
        # Keep the first user's email, and modify the rest
        for i, user in enumerate(users):
            if i > 0:
                # Assign a unique, temporary email value. 
                user.email = f'duplicate_empty_{user.pk}@temp.com'
                user.save()
                print(f"Fixed user {user.pk} with email: {user.email}")
                
print("--- Data cleanup complete ---")