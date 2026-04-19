"""
ICEN API Backend Tests
Tests for: applications, auth, admin endpoints, stats
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@icen.org"
ADMIN_PASSWORD = "ICEN@Admin2026"


class TestHealthAndStats:
    """Health check and public stats endpoints"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == "ICEN API"
        assert data["status"] == "ok"
        print(f"✓ API root: {data}")
    
    def test_public_stats(self):
        """Test GET /api/stats returns public stats"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "nations" in data
        assert "pillars" in data
        assert "regions" in data
        assert "members" in data
        assert data["nations"] == 50
        assert data["pillars"] == 12
        assert data["regions"] == 8
        assert data["members"] >= 10000
        print(f"✓ Public stats: {data}")


class TestApplications:
    """Membership application endpoints"""
    
    def test_create_application_success(self):
        """Test POST /api/applications with valid payload"""
        payload = {
            "full_name": "TEST_John Doe",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "country": "Nigeria",
            "organization": "Test Ministry",
            "role_title": "Director",
            "membership_tier": "fellow",
            "focus_pillars": ["Technology", "Finance"],
            "motivation": "I want to contribute to emerging nations development and help build a better future for all.",
            "linkedin": "https://linkedin.com/in/testuser"
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "id" in data
        assert data["full_name"] == payload["full_name"]
        assert data["email"] == payload["email"]
        assert data["country"] == payload["country"]
        assert data["membership_tier"] == payload["membership_tier"]
        assert data["status"] == "pending"
        assert "created_at" in data
        print(f"✓ Application created with ID: {data['id']}")
        return data["id"]
    
    def test_create_application_invalid_email(self):
        """Test POST /api/applications with invalid email returns 422"""
        payload = {
            "full_name": "TEST_Invalid Email",
            "email": "not-an-email",
            "country": "Nigeria",
            "motivation": "This is a test motivation that is at least 30 characters long."
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Invalid email rejected with 422")
    
    def test_create_application_short_motivation(self):
        """Test POST /api/applications with too-short motivation returns 422"""
        payload = {
            "full_name": "TEST_Short Motivation",
            "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
            "country": "Nigeria",
            "motivation": "Too short"  # Less than 30 chars
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print(f"✓ Short motivation rejected with 422")


class TestAuth:
    """Authentication endpoints"""
    
    def test_login_success(self):
        """Test POST /api/auth/login with correct admin credentials"""
        payload = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == ADMIN_EMAIL.lower()
        assert data["user"]["role"] == "admin"
        assert len(data["access_token"]) > 0
        print(f"✓ Admin login successful, token received")
        return data["access_token"]
    
    def test_login_wrong_password(self):
        """Test POST /api/auth/login with wrong password returns 401"""
        payload = {"email": ADMIN_EMAIL, "password": "wrongpassword"}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Wrong password rejected with 401")
    
    def test_login_wrong_email(self):
        """Test POST /api/auth/login with non-existent email returns 401"""
        payload = {"email": "nonexistent@icen.org", "password": ADMIN_PASSWORD}
        response = requests.post(f"{BASE_URL}/api/auth/login", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Non-existent email rejected with 401")
    
    def test_me_with_token(self):
        """Test GET /api/auth/me with valid token returns admin user"""
        # First login to get token
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        token = login_resp.json()["access_token"]
        
        # Now test /me endpoint
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {token}"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["email"] == ADMIN_EMAIL.lower()
        assert data["role"] == "admin"
        print(f"✓ /auth/me returned admin user: {data['email']}")
    
    def test_me_without_token(self):
        """Test GET /api/auth/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ /auth/me without token rejected with 401")


class TestAdminEndpoints:
    """Admin protected endpoints"""
    
    @pytest.fixture
    def auth_token(self):
        """Get admin auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        if response.status_code != 200:
            pytest.skip("Could not authenticate admin")
        return response.json()["access_token"]
    
    def test_admin_applications_list(self, auth_token):
        """Test GET /api/admin/applications returns list"""
        response = requests.get(f"{BASE_URL}/api/admin/applications", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "items" in data
        assert "count" in data
        assert isinstance(data["items"], list)
        print(f"✓ Admin applications list: {data['count']} items")
    
    def test_admin_applications_without_auth(self):
        """Test GET /api/admin/applications without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/applications")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Admin applications without auth rejected with 401")
    
    def test_admin_stats(self, auth_token):
        """Test GET /api/admin/stats returns status counts"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "total" in data
        assert "pending" in data
        assert "reviewing" in data
        assert "approved" in data
        assert "rejected" in data
        print(f"✓ Admin stats: total={data['total']}, pending={data['pending']}")
    
    def test_admin_stats_without_auth(self):
        """Test GET /api/admin/stats without auth returns 401"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Admin stats without auth rejected with 401")
    
    def test_update_application_status(self, auth_token):
        """Test PATCH /api/admin/applications/{id}/status updates status"""
        # First create an application
        app_payload = {
            "full_name": "TEST_Status Update",
            "email": f"test_status_{uuid.uuid4().hex[:8]}@example.com",
            "country": "Kenya",
            "motivation": "Testing status update functionality for ICEN applications."
        }
        create_resp = requests.post(f"{BASE_URL}/api/applications", json=app_payload)
        assert create_resp.status_code == 200
        app_id = create_resp.json()["id"]
        
        # Update status to reviewing
        response = requests.patch(
            f"{BASE_URL}/api/admin/applications/{app_id}/status",
            json={"status": "reviewing"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["status"] == "reviewing"
        print(f"✓ Application status updated to 'reviewing'")
        
        # Update to approved
        response = requests.patch(
            f"{BASE_URL}/api/admin/applications/{app_id}/status",
            json={"status": "approved"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "approved"
        print(f"✓ Application status updated to 'approved'")
    
    def test_update_status_unknown_id(self, auth_token):
        """Test PATCH /api/admin/applications/{id}/status with unknown ID returns 404"""
        fake_id = str(uuid.uuid4())
        response = requests.patch(
            f"{BASE_URL}/api/admin/applications/{fake_id}/status",
            json={"status": "reviewing"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print(f"✓ Unknown application ID rejected with 404")
    
    def test_update_status_without_auth(self):
        """Test PATCH /api/admin/applications/{id}/status without auth returns 401"""
        fake_id = str(uuid.uuid4())
        response = requests.patch(
            f"{BASE_URL}/api/admin/applications/{fake_id}/status",
            json={"status": "reviewing"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Status update without auth rejected with 401")


class TestAdminSeeding:
    """Test admin seeding is idempotent"""
    
    def test_admin_exists_and_can_login(self):
        """Verify admin user exists and credentials work"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert data["user"]["email"] == ADMIN_EMAIL.lower()
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin seeding verified - admin can login")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
