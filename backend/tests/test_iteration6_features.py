"""
ICEN Iteration 6 Backend Tests
Tests for:
- POST /api/admin/upload (multipart file upload with Bearer token)
- GET /api/media/{id} (serve uploaded images)
- Existing endpoints still work (blog, research, applications, auth, admin stats)
"""
import pytest
import requests
import os
import io

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
ADMIN_EMAIL = "admin@icen.org"
ADMIN_PASSWORD = "ICEN@Admin2026"


@pytest.fixture(scope="module")
def auth_token():
    """Get admin authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    assert response.status_code == 200, f"Login failed: {response.text}"
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token):
    """Headers with Bearer token"""
    return {"Authorization": f"Bearer {auth_token}"}


class TestMediaUpload:
    """Tests for POST /api/admin/upload endpoint"""

    def test_upload_requires_auth(self):
        """Upload without token should return 401"""
        # Create a small PNG file (1x1 pixel)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {"file": ("test.png", io.BytesIO(png_data), "image/png")}
        response = requests.post(f"{BASE_URL}/api/admin/upload", files=files)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("PASS: Upload without auth returns 401")

    def test_upload_png_success(self, auth_headers):
        """Upload valid PNG should succeed"""
        # Create a small PNG file (1x1 pixel)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {"file": ("test.png", io.BytesIO(png_data), "image/png")}
        response = requests.post(f"{BASE_URL}/api/admin/upload", files=files, headers=auth_headers)
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert "id" in data, "Response missing 'id'"
        assert "url" in data, "Response missing 'url'"
        assert "size" in data, "Response missing 'size'"
        assert "content_type" in data, "Response missing 'content_type'"
        assert data["content_type"] == "image/png"
        assert data["size"] == len(png_data)
        print(f"PASS: PNG upload successful, id={data['id']}, size={data['size']}")
        return data

    def test_upload_jpeg_success(self, auth_headers):
        """Upload valid JPEG should succeed"""
        # Minimal valid JPEG
        jpeg_data = bytes([
            0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
            0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
            0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
            0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
            0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
            0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
            0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
            0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x0B, 0x08, 0x00, 0x01,
            0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xFF, 0xC4, 0x00, 0x1F, 0x00, 0x00,
            0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
            0x09, 0x0A, 0x0B, 0xFF, 0xC4, 0x00, 0xB5, 0x10, 0x00, 0x02, 0x01, 0x03,
            0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7D,
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
            0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xA1, 0x08,
            0x23, 0x42, 0xB1, 0xC1, 0x15, 0x52, 0xD1, 0xF0, 0x24, 0x33, 0x62, 0x72,
            0x82, 0x09, 0x0A, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2A, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x43, 0x44, 0x45,
            0x46, 0x47, 0x48, 0x49, 0x4A, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5A, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6A, 0x73, 0x74, 0x75,
            0x76, 0x77, 0x78, 0x79, 0x7A, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8A, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9A, 0xA2, 0xA3,
            0xA4, 0xA5, 0xA6, 0xA7, 0xA8, 0xA9, 0xAA, 0xB2, 0xB3, 0xB4, 0xB5, 0xB6,
            0xB7, 0xB8, 0xB9, 0xBA, 0xC2, 0xC3, 0xC4, 0xC5, 0xC6, 0xC7, 0xC8, 0xC9,
            0xCA, 0xD2, 0xD3, 0xD4, 0xD5, 0xD6, 0xD7, 0xD8, 0xD9, 0xDA, 0xE1, 0xE2,
            0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xF1, 0xF2, 0xF3, 0xF4,
            0xF5, 0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFF, 0xDA, 0x00, 0x08, 0x01, 0x01,
            0x00, 0x00, 0x3F, 0x00, 0xFB, 0xD5, 0xDB, 0x20, 0xA8, 0xA8, 0xA8, 0x00,
            0x00, 0x00, 0xFF, 0xD9
        ])
        files = {"file": ("test.jpg", io.BytesIO(jpeg_data), "image/jpeg")}
        response = requests.post(f"{BASE_URL}/api/admin/upload", files=files, headers=auth_headers)
        assert response.status_code == 200, f"Upload failed: {response.text}"
        data = response.json()
        assert data["content_type"] == "image/jpeg"
        print(f"PASS: JPEG upload successful, id={data['id']}")

    def test_upload_rejects_non_image(self, auth_headers):
        """Upload non-image content-type should return 400"""
        text_data = b"This is not an image"
        files = {"file": ("test.txt", io.BytesIO(text_data), "text/plain")}
        response = requests.post(f"{BASE_URL}/api/admin/upload", files=files, headers=auth_headers)
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("PASS: Non-image upload rejected with 400")

    def test_upload_rejects_large_file(self, auth_headers):
        """Upload file > 5MB should return 400"""
        # Create a 6MB file
        large_data = b'\x89PNG\r\n\x1a\n' + (b'\x00' * (6 * 1024 * 1024))
        files = {"file": ("large.png", io.BytesIO(large_data), "image/png")}
        response = requests.post(f"{BASE_URL}/api/admin/upload", files=files, headers=auth_headers)
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        assert "too large" in response.json().get("detail", "").lower() or "5MB" in response.json().get("detail", "")
        print("PASS: Large file rejected with 400")


class TestMediaServing:
    """Tests for GET /api/media/{id} endpoint"""

    def test_get_uploaded_media(self, auth_headers):
        """Upload then retrieve media should work"""
        # First upload
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N\x00\x00\x00\x00IEND\xaeB`\x82'
        files = {"file": ("test.png", io.BytesIO(png_data), "image/png")}
        upload_response = requests.post(f"{BASE_URL}/api/admin/upload", files=files, headers=auth_headers)
        assert upload_response.status_code == 200
        media_id = upload_response.json()["id"]

        # Then retrieve (no auth needed for serving)
        get_response = requests.get(f"{BASE_URL}/api/media/{media_id}")
        assert get_response.status_code == 200, f"Get media failed: {get_response.status_code}"
        assert get_response.headers.get("Content-Type") == "image/png"
        assert "Cache-Control" in get_response.headers
        assert get_response.content == png_data
        print(f"PASS: Media retrieved successfully, content-type={get_response.headers.get('Content-Type')}")

    def test_get_unknown_media_returns_404(self):
        """Get non-existent media should return 404"""
        response = requests.get(f"{BASE_URL}/api/media/nonexistent-id-12345")
        assert response.status_code == 404
        print("PASS: Unknown media returns 404")


class TestExistingEndpoints:
    """Verify existing endpoints still work after changes"""

    def test_auth_login(self):
        """POST /api/auth/login should work"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        print("PASS: Auth login works")

    def test_auth_me(self, auth_headers):
        """GET /api/auth/me should work"""
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("email") == ADMIN_EMAIL
        print("PASS: Auth me works")

    def test_admin_stats(self, auth_headers):
        """GET /api/admin/stats should work"""
        response = requests.get(f"{BASE_URL}/api/admin/stats", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "total" in data
        assert "pending" in data
        assert "blog_posts" in data
        assert "research_papers" in data
        print(f"PASS: Admin stats works - total={data['total']}, blog={data['blog_posts']}, research={data['research_papers']}")

    def test_admin_applications(self, auth_headers):
        """GET /api/admin/applications should work"""
        response = requests.get(f"{BASE_URL}/api/admin/applications", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "count" in data
        print(f"PASS: Admin applications works - count={data['count']}")

    def test_blog_list(self):
        """GET /api/blog should work"""
        response = requests.get(f"{BASE_URL}/api/blog")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        print(f"PASS: Blog list works - count={len(data['items'])}")

    def test_research_list(self):
        """GET /api/research should work"""
        response = requests.get(f"{BASE_URL}/api/research")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        print(f"PASS: Research list works - count={len(data['items'])}")

    def test_public_stats(self):
        """GET /api/stats should work"""
        response = requests.get(f"{BASE_URL}/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "nations" in data
        assert "pillars" in data
        print(f"PASS: Public stats works - nations={data['nations']}, pillars={data['pillars']}")

    def test_create_application(self):
        """POST /api/applications should work"""
        response = requests.post(
            f"{BASE_URL}/api/applications",
            json={
                "full_name": "TEST_Iteration6_User",
                "email": f"test_iter6_{os.urandom(4).hex()}@example.com",
                "country": "Test Country",
                "motivation": "Testing iteration 6 features - this is a test application to verify the endpoint still works correctly.",
                "membership_tier": "fellow"
            }
        )
        assert response.status_code == 200, f"Create application failed: {response.text}"
        data = response.json()
        assert "id" in data
        print(f"PASS: Create application works - id={data['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
