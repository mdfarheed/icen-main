"""
ICEN Backend API Tests - Blog, Research, and Admin CRUD
Tests for new blog/research endpoints and admin CRUD operations.
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@icen.org"
ADMIN_PASSWORD = "ICEN@Admin2026"


@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="module")
def auth_token(api_client):
    """Get authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json().get("access_token")


@pytest.fixture(scope="module")
def auth_header(auth_token):
    """Auth header for protected endpoints"""
    return {"Authorization": f"Bearer {auth_token}"}


# ============ PUBLIC BLOG ENDPOINTS ============

class TestPublicBlogEndpoints:
    """Tests for public blog endpoints"""

    def test_get_blog_list(self, api_client):
        """GET /api/blog returns list of published blog posts"""
        response = api_client.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        # Should have seeded blog posts (6 expected)
        assert data["count"] >= 5, f"Expected at least 5 blog posts, got {data['count']}"
        # Verify structure of first item
        if data["items"]:
            item = data["items"][0]
            assert "id" in item
            assert "slug" in item
            assert "title" in item
            assert "excerpt" in item
            assert "body" in item
            assert "published" in item
            assert item["published"] is True  # Only published posts returned

    def test_get_blog_by_slug_valid(self, api_client):
        """GET /api/blog/{slug} returns single post for valid slug"""
        # First get list to find a valid slug
        list_response = api_client.get(f"{BASE_URL}/api/blog")
        assert list_response.status_code == 200
        items = list_response.json()["items"]
        assert len(items) > 0, "No blog posts found"
        
        slug = items[0]["slug"]
        response = api_client.get(f"{BASE_URL}/api/blog/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        assert "title" in data
        assert "body" in data
        assert "excerpt" in data

    def test_get_blog_by_slug_invalid(self, api_client):
        """GET /api/blog/{slug} returns 404 for unknown slug"""
        response = api_client.get(f"{BASE_URL}/api/blog/nonexistent-slug-12345")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data


# ============ PUBLIC RESEARCH ENDPOINTS ============

class TestPublicResearchEndpoints:
    """Tests for public research endpoints"""

    def test_get_research_list(self, api_client):
        """GET /api/research returns list of published research papers"""
        response = api_client.get(f"{BASE_URL}/api/research")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        # Should have seeded research papers (5 expected)
        assert data["count"] >= 4, f"Expected at least 4 research papers, got {data['count']}"
        # Verify structure
        if data["items"]:
            item = data["items"][0]
            assert "id" in item
            assert "slug" in item
            assert "title" in item
            assert "abstract" in item
            assert "body" in item
            assert "published" in item

    def test_get_research_by_slug_valid(self, api_client):
        """GET /api/research/{slug} returns single paper for valid slug"""
        list_response = api_client.get(f"{BASE_URL}/api/research")
        assert list_response.status_code == 200
        items = list_response.json()["items"]
        assert len(items) > 0, "No research papers found"
        
        slug = items[0]["slug"]
        response = api_client.get(f"{BASE_URL}/api/research/{slug}")
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == slug
        assert "title" in data
        assert "abstract" in data
        assert "body" in data

    def test_get_research_by_slug_invalid(self, api_client):
        """GET /api/research/{slug} returns 404 for unknown slug"""
        response = api_client.get(f"{BASE_URL}/api/research/nonexistent-paper-12345")
        assert response.status_code == 404


# ============ ADMIN BLOG CRUD ============

class TestAdminBlogCRUD:
    """Tests for admin blog CRUD operations"""

    def test_admin_blog_requires_auth(self, api_client):
        """Admin blog endpoints return 401 without Bearer token"""
        # GET
        response = api_client.get(f"{BASE_URL}/api/admin/blog")
        assert response.status_code == 401
        
        # POST
        response = api_client.post(f"{BASE_URL}/api/admin/blog", json={
            "title": "Test", "excerpt": "Test excerpt", "body": "Test body content here"
        })
        assert response.status_code == 401

    def test_admin_blog_list_includes_drafts(self, api_client, auth_header):
        """GET /api/admin/blog lists all posts including drafts"""
        response = api_client.get(f"{BASE_URL}/api/admin/blog", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data

    def test_admin_blog_crud_flow(self, api_client, auth_header):
        """Full CRUD flow: Create -> Read -> Update -> Delete"""
        unique_id = str(uuid.uuid4())[:8]
        
        # CREATE
        create_payload = {
            "title": f"TEST_Blog Post {unique_id}",
            "excerpt": f"Test excerpt for blog post {unique_id}",
            "body": f"This is the full body content for the test blog post {unique_id}. It needs to be at least 30 characters.",
            "author": "Test Author",
            "tags": ["test", "automation"],
            "published": True
        }
        create_response = api_client.post(f"{BASE_URL}/api/admin/blog", json=create_payload, headers=auth_header)
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        created = create_response.json()
        assert "id" in created
        assert "slug" in created
        assert created["title"] == create_payload["title"]
        post_id = created["id"]
        
        # READ - verify in admin list
        list_response = api_client.get(f"{BASE_URL}/api/admin/blog", headers=auth_header)
        assert list_response.status_code == 200
        items = list_response.json()["items"]
        found = any(item["id"] == post_id for item in items)
        assert found, "Created post not found in admin list"
        
        # UPDATE
        update_payload = {
            "title": f"TEST_Updated Blog Post {unique_id}",
            "excerpt": f"Updated excerpt for blog post {unique_id}",
            "body": f"This is the updated body content for the test blog post {unique_id}. It needs to be at least 30 characters.",
            "author": "Updated Author",
            "tags": ["test", "updated"],
            "published": True
        }
        update_response = api_client.patch(f"{BASE_URL}/api/admin/blog/{post_id}", json=update_payload, headers=auth_header)
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        updated = update_response.json()
        assert updated["title"] == update_payload["title"]
        assert updated["author"] == update_payload["author"]
        
        # DELETE
        delete_response = api_client.delete(f"{BASE_URL}/api/admin/blog/{post_id}", headers=auth_header)
        assert delete_response.status_code == 200
        
        # Verify deletion
        list_after = api_client.get(f"{BASE_URL}/api/admin/blog", headers=auth_header)
        items_after = list_after.json()["items"]
        found_after = any(item["id"] == post_id for item in items_after)
        assert not found_after, "Post still exists after deletion"


# ============ ADMIN RESEARCH CRUD ============

class TestAdminResearchCRUD:
    """Tests for admin research CRUD operations"""

    def test_admin_research_requires_auth(self, api_client):
        """Admin research endpoints return 401 without Bearer token"""
        response = api_client.get(f"{BASE_URL}/api/admin/research")
        assert response.status_code == 401
        
        response = api_client.post(f"{BASE_URL}/api/admin/research", json={
            "title": "Test", "abstract": "Test abstract content", "body": "Test body content here"
        })
        assert response.status_code == 401

    def test_admin_research_list(self, api_client, auth_header):
        """GET /api/admin/research lists all papers"""
        response = api_client.get(f"{BASE_URL}/api/admin/research", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data

    def test_admin_research_crud_flow(self, api_client, auth_header):
        """Full CRUD flow: Create -> Read -> Update -> Delete"""
        unique_id = str(uuid.uuid4())[:8]
        
        # CREATE
        create_payload = {
            "title": f"TEST_Research Paper {unique_id}",
            "abstract": f"Test abstract for research paper {unique_id}. This needs to be at least 20 characters.",
            "body": f"This is the full body content for the test research paper {unique_id}. It needs to be at least 30 characters.",
            "authors": ["Dr. Test Author", "Prof. Test Coauthor"],
            "pillar": "Technology & Sovereignty",
            "published": True
        }
        create_response = api_client.post(f"{BASE_URL}/api/admin/research", json=create_payload, headers=auth_header)
        assert create_response.status_code == 200, f"Create failed: {create_response.text}"
        created = create_response.json()
        assert "id" in created
        assert "slug" in created
        assert created["title"] == create_payload["title"]
        paper_id = created["id"]
        
        # READ - verify in admin list
        list_response = api_client.get(f"{BASE_URL}/api/admin/research", headers=auth_header)
        assert list_response.status_code == 200
        items = list_response.json()["items"]
        found = any(item["id"] == paper_id for item in items)
        assert found, "Created paper not found in admin list"
        
        # UPDATE
        update_payload = {
            "title": f"TEST_Updated Research Paper {unique_id}",
            "abstract": f"Updated abstract for research paper {unique_id}. This needs to be at least 20 characters.",
            "body": f"This is the updated body content for the test research paper {unique_id}. It needs to be at least 30 characters.",
            "authors": ["Dr. Updated Author"],
            "pillar": "Climate & Energy",
            "published": True
        }
        update_response = api_client.patch(f"{BASE_URL}/api/admin/research/{paper_id}", json=update_payload, headers=auth_header)
        assert update_response.status_code == 200, f"Update failed: {update_response.text}"
        updated = update_response.json()
        assert updated["title"] == update_payload["title"]
        assert updated["pillar"] == update_payload["pillar"]
        
        # DELETE
        delete_response = api_client.delete(f"{BASE_URL}/api/admin/research/{paper_id}", headers=auth_header)
        assert delete_response.status_code == 200
        
        # Verify deletion
        list_after = api_client.get(f"{BASE_URL}/api/admin/research", headers=auth_header)
        items_after = list_after.json()["items"]
        found_after = any(item["id"] == paper_id for item in items_after)
        assert not found_after, "Paper still exists after deletion"


# ============ ADMIN STATS ============

class TestAdminStats:
    """Tests for admin stats endpoint"""

    def test_admin_stats_includes_blog_research_counts(self, api_client, auth_header):
        """GET /api/admin/stats includes blog_posts and research_papers counts"""
        response = api_client.get(f"{BASE_URL}/api/admin/stats", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        
        # Original fields
        assert "total" in data
        assert "pending" in data
        assert "reviewing" in data
        assert "approved" in data
        assert "rejected" in data
        
        # New fields for blog and research
        assert "blog_posts" in data, "Missing blog_posts count in stats"
        assert "research_papers" in data, "Missing research_papers count in stats"
        assert isinstance(data["blog_posts"], int)
        assert isinstance(data["research_papers"], int)


# ============ EXISTING ENDPOINTS STILL WORK ============

class TestExistingEndpoints:
    """Verify existing endpoints still work after new features"""

    def test_auth_login(self, api_client):
        """POST /api/auth/login works"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data

    def test_auth_me(self, api_client, auth_header):
        """GET /api/auth/me works"""
        response = api_client.get(f"{BASE_URL}/api/auth/me", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert "email" in data
        assert data["email"] == ADMIN_EMAIL.lower()

    def test_public_stats(self, api_client):
        """GET /api/stats works"""
        response = api_client.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "nations" in data
        assert "pillars" in data
        assert "regions" in data
        assert "members" in data

    def test_applications_create(self, api_client):
        """POST /api/applications works"""
        unique_id = str(uuid.uuid4())[:8]
        response = api_client.post(f"{BASE_URL}/api/applications", json={
            "full_name": f"TEST_User {unique_id}",
            "email": f"test_{unique_id}@example.com",
            "country": "Test Country",
            "motivation": "This is a test motivation that needs to be at least 30 characters long for validation."
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert data["status"] == "pending"

    def test_admin_applications_list(self, api_client, auth_header):
        """GET /api/admin/applications works"""
        response = api_client.get(f"{BASE_URL}/api/admin/applications", headers=auth_header)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
