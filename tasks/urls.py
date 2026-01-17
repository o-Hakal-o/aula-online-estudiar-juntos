from django.urls import path , include
from rest_framework import routers
from . import views
from rest_framework.documentation import include_docs_urls
from .views import LoginView, FileManagementView, FileDownloadView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import LoginView, FileManagementView , PasswordResetRequestView ,PasswordResetConfirmView

#from .views import RegisterView

router = routers.DefaultRouter()


urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("docs/", include_docs_urls(title = "Tasks_Users")),
    #path('auth/register/', RegisterView.as_view(), name='register'),
    
    # 2. Login (Authentication) - Returns access and refresh tokens
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    # 3. Token Refresh - Get a new access token using a valid refresh token
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # 4. Redirect t the place where the teachers uppload archives 
    path('api/files/', FileManagementView.as_view(), name='files_manager'),
    path('api/files/download/<int:file_id>/', FileDownloadView.as_view(), name='file_download'),
   path('auth/password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
   path('auth/password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
   path('setup-admin-secret-99/', create_admin_temporal)
]