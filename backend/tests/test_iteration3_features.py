"""
ICEN API Backend Tests - Iteration 3 Features
Tests for: phone field in applications, blog/research endpoints, admin CRUD
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@icen.org"
ADMIN_PASSWORD = "ICEN@Admin2026"


@pytest.fixture(scope="module")
def auth_token():
    """Get admin auth token for the module"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
    })
    if response.status_code != 200:
        pytest.skip("Could not authenticate admin")
    return response.json()["access_token"]


class TestPhoneFieldInApplications:
    """Test new phone field in membership applications"""
    
    def test_create_application_with_phone(self):
        """Test POST /api/applications with phone field"""
        payload = {
            "full_name": "TEST_Phone User",
            "email": f"test_phone_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+234 802 000 0000",
            "country": "Nigeria",
            "organization": "Test Ministry",
            "role_title": "Director",
            "membership_tier": "fellow",
            "focus_pillars": ["Technology"],
            "motivation": "Testing phone field in ICEN membership applications.",
            "linkedin": "https://linkedin.com/in/testuser"
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Verify phone field is returned
        assert "phone" in data, "Phone field missing from response"
        assert data["phone"] == payload["phone"], f"Phone mismatch: expected {payload['phone']}, got {data['phone']}"
        assert data["full_name"] == payload["full_name"]
        assert data["status"] == "pending"
        print(f"✓ Application with phone created: {data['id']}, phone: {data['phone']}")
        return data["id"]
    
    def test_create_application_without_phone(self):
        """Test POST /api/applications without phone field (should succeed - phone is optional)"""
        payload = {
            "full_name": "TEST_No Phone User",
            "email": f"test_nophone_{uuid.uuid4().hex[:8]}@example.com",
            "country": "Kenya",
            "motivation": "Testing application without phone field - should still work."
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Phone should be None or not present
        assert data.get("phone") is None or "phone" not in data or data["phone"] == "", \
            f"Phone should be None/empty for application without phone, got: {data.get('phone')}"
        print(f"✓ Application without phone created: {data['id']}")
        return data["id"]
    
    def test_create_application_with_empty_phone(self):
        """Test POST /api/applications with empty phone string"""
        payload = {
            "full_name": "TEST_Empty Phone User",
            "email": f"test_emptyphone_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "",
            "country": "Ghana",
            "motivation": "Testing application with empty phone string - should work."
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        print(f"✓ Application with empty phone created: {data['id']}")
    
    def test_phone_max_length_validation(self):
        """Test phone field max length (40 chars)"""
        payload = {
            "full_name": "TEST_Long Phone User",
            "email": f"test_longphone_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+" + "1" * 50,  # 51 chars, exceeds 40 char limit
            "country": "South Africa",
            "motivation": "Testing phone field max length validation in ICEN."
        }
        response = requests.post(f"{BASE_URL}/api/applications", json=payload)
        assert response.status_code == 422, f"Expected 422 for too-long phone, got {response.status_code}"
        print(f"✓ Too-long phone rejected with 422")


class TestPhoneInAdminApplications:
    """Test phone field visibility in admin endpoints"""
    
    def test_admin_applications_list_includes_phone(self, auth_token):
        """Test GET /api/admin/applications returns phone field"""
        # First create an application with phone
        app_payload = {
            "full_name": "TEST_Admin Phone Check",
            "email": f"test_adminphone_{uuid.uuid4().hex[:8]}@example.com",
            "phone": "+1 555 123 4567",
            "country": "Brazil",
            "motivation": "Testing phone visibility in admin applications list."
        }
        create_resp = requests.post(f"{BASE_URL}/api/applications", json=app_payload)
        assert create_resp.status_code == 200
        created_id = create_resp.json()["id"]
        
        # Now fetch admin applications list
        response = requests.get(f"{BASE_URL}/api/admin/applications", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        
        # Find our created application
        found = None
        for item in data["items"]:
            if item["id"] == created_id:
                found = item
                break
        
        assert found is not None, f"Created application {created_id} not found in admin list"
        assert "phone" in found, "Phone field missing from admin applications list"
        assert found["phone"] == app_payload["phone"], f"Phone mismatch in admin list"
        print(f"✓ Admin applications list includes phone: {found['phone']}")


class TestExistingEndpointsStillWork:
    """Verify existing endpoints still work after changes"""
    
    def test_auth_login(self):
        """Test POST /api/auth/login still works"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL, "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == ADMIN_EMAIL.lower()
        print(f"✓ Auth login works")
    
    def test_auth_me(self, auth_token):
        """Test GET /api/auth/me still works"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == ADMIN_EMAIL.lower()
        print(f"✓ Auth me works")
    
    def test_admin_stats(self, auth_token):
        """Test GET /api/admin/stats still works"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "pending" in data
        assert "blog_posts" in data
        assert "research_papers" in data
        print(f"✓ Admin stats works: total={data['total']}, blog={data['blog_posts']}, research={data['research_papers']}")
    
    def test_patch_application_status(self, auth_token):
        """Test PATCH /api/admin/applications/{id}/status still works"""
        # Create an application
        app_payload = {
            "full_name": "TEST_Status Check",
            "email": f"test_status_{uuid.uuid4().hex[:8]}@example.com",
            "country": "India",
            "motivation": "Testing status update still works after iteration 3 changes."
        }
        create_resp = requests.post(f"{BASE_URL}/api/applications", json=app_payload)
        assert create_resp.status_code == 200
        app_id = create_resp.json()["id"]
        
        # Update status
        response = requests.patch(
            f"{BASE_URL}/api/admin/applications/{app_id}/status",
            json={"status": "reviewing"},
            headers={"Authorization": f"Bearer {auth_token}"}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "reviewing"
        print(f"✓ Status update works")


class TestBlogEndpoints:
    """Test blog endpoints still work"""
    
    def test_get_blog_list(self):
        """Test GET /api/blog returns list"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) >= 1, "Expected at least 1 seeded blog post"
        print(f"✓ Blog list: {len(data['items'])} posts")
    
    def test_get_blog_by_slug(self):
        """Test GET /api/blog/{slug} returns post"""
        # First get list to find a valid slug
        list_resp = requests.get(f"{BASE_URL}/api/blog")
        items = list_resp.json()["items"]
        if not items:
            pytest.skip("No blog posts to test")
        
        slug = items[0]["slug"]
        response = requests.get(f"{BASE_URL}/api/blog/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        assert "title" in data
        assert "body" in data
        print(f"✓ Blog by slug works: {slug}")
    
    def test_get_blog_invalid_slug(self):
        """Test GET /api/blog/{slug} with invalid slug returns 404"""
        response = requests.get(f"{BASE_URL}/api/blog/nonexistent-slug-12345")
        assert response.status_code == 404
        print(f"✓ Invalid blog slug returns 404")
    
    def test_admin_blog_crud(self, auth_token):
        """Test admin blog CRUD operations"""
        # Create
        create_payload = {
            "title": "TEST_Blog Post",
            "excerpt": "This is a test blog post excerpt for iteration 3 testing.",
            "body": "This is the full body of the test blog post. It needs to be at least 30 characters.",
            "tags": ["test", "iteration3"],
            "published": True
        }
        create_resp = requests.post(f"{BASE_URL}/api/admin/blog", json=create_payload, headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert create_resp.status_code == 200, f"Create failed: {create_resp.text}"
        created = create_resp.json()
        assert created["title"] == create_payload["title"]
        post_id = created["id"]
        print(f"✓ Blog created: {post_id}")
        
        # Update
        update_payload = {
            "title": "TEST_Blog Post Updated",
            "excerpt": "Updated excerpt for the test blog post.",
            "body": "Updated body content that is at least 30 characters long.",
            "tags": ["test", "updated"],
            "published": True
        }
        update_resp = requests.patch(f"{BASE_URL}/api/admin/blog/{post_id}", json=update_payload, headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert update_resp.status_code == 200
        assert update_resp.json()["title"] == update_payload["title"]
        print(f"✓ Blog updated")
        
        # Delete
        delete_resp = requests.delete(f"{BASE_URL}/api/admin/blog/{post_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert delete_resp.status_code == 200
        print(f"✓ Blog deleted")


class TestResearchEndpoints:
    """Test research endpoints still work"""
    
    def test_get_research_list(self):
        """Test GET /api/research returns list"""
        response = requests.get(f"{BASE_URL}/api/research")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        assert len(data["items"]) >= 1, "Expected at least 1 seeded research paper"
        print(f"✓ Research list: {len(data['items'])} papers")
    
    def test_get_research_by_slug(self):
        """Test GET /api/research/{slug} returns paper"""
        # First get list to find a valid slug
        list_resp = requests.get(f"{BASE_URL}/api/research")
        items = list_resp.json()["items"]
        if not items:
            pytest.skip("No research papers to test")
        
        slug = items[0]["slug"]
        response = requests.get(f"{BASE_URL}/api/research/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        assert "title" in data
        assert "abstract" in data
        print(f"✓ Research by slug works: {slug}")
    
    def test_get_research_invalid_slug(self):
        """Test GET /api/research/{slug} with invalid slug returns 404"""
        response = requests.get(f"{BASE_URL}/api/research/nonexistent-slug-12345")
        assert response.status_code == 404
        print(f"✓ Invalid research slug returns 404")
    
    def test_admin_research_crud(self, auth_token):
        """Test admin research CRUD operations"""
        # Create
        create_payload = {
            "title": "TEST_Research Paper",
            "abstract": "This is a test research paper abstract for iteration 3 testing.",
            "body": "This is the full body of the test research paper. It needs to be at least 30 characters.",
            "authors": ["Test Author"],
            "pillar": "Observatory",
            "published": True
        }
        create_resp = requests.post(f"{BASE_URL}/api/admin/research", json=create_payload, headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert create_resp.status_code == 200, f"Create failed: {create_resp.text}"
        created = create_resp.json()
        assert created["title"] == create_payload["title"]
        paper_id = created["id"]
        print(f"✓ Research created: {paper_id}")
        
        # Update
        update_payload = {
            "title": "TEST_Research Paper Updated",
            "abstract": "Updated abstract for the test research paper.",
            "body": "Updated body content that is at least 30 characters long.",
            "authors": ["Test Author", "Second Author"],
            "pillar": "Technology & Sovereignty",
            "published": True
        }
        update_resp = requests.patch(f"{BASE_URL}/api/admin/research/{paper_id}", json=update_payload, headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert update_resp.status_code == 200
        assert update_resp.json()["title"] == update_payload["title"]
        print(f"✓ Research updated")
        
        # Delete
        delete_resp = requests.delete(f"{BASE_URL}/api/admin/research/{paper_id}", headers={
            "Authorization": f"Bearer {auth_token}"
        })
        assert delete_resp.status_code == 200
        print(f"✓ Research deleted")


class TestBlogTagsAndResearchPillars:
    """Test that blog posts have tags and research papers have pillars"""
    
    def test_blog_posts_have_tags(self):
        """Verify seeded blog posts have tags"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        items = response.json()["items"]
        
        # Collect all unique tags
        all_tags = set()
        for item in items:
            tags = item.get("tags", [])
            all_tags.update(tags)
        
        assert len(all_tags) > 0, "Expected blog posts to have tags"
        print(f"✓ Blog tags found: {sorted(all_tags)}")
    
    def test_research_papers_have_pillars(self):
        """Verify seeded research papers have pillars"""
        response = requests.get(f"{BASE_URL}/api/research")
        assert response.status_code == 200
        items = response.json()["items"]
        
        # Collect all unique pillars
        all_pillars = set()
        for item in items:
            pillar = item.get("pillar")
            if pillar:
                all_pillars.add(pillar)
        
        assert len(all_pillars) > 0, "Expected research papers to have pillars"
        print(f"✓ Research pillars found: {sorted(all_pillars)}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
