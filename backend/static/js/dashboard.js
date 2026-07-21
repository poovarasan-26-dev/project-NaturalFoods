/* ═══════════════════════════════════════════════════════════════
   NATURAL FOODS ADMIN - Dashboard JavaScript
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

    /* ─── Sidebar Toggle (Mobile) ────────────────────────── */
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sidebarToggle) sidebarToggle.addEventListener('click', openSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    /* ─── Dropdown Toggle ────────────────────────────────── */
    const dropdowns = document.querySelectorAll('.header-icon-dropdown');
    dropdowns.forEach(function (dd) {
        const btn = dd.querySelector('.icon-btn');
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isOpen = dd.classList.contains('open');
                // Close all
                dropdowns.forEach(function (d) { d.classList.remove('open'); });
                // Toggle current
                if (!isOpen) dd.classList.add('open');
            });
        }
    });

    // Close dropdowns on outside click
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.header-icon-dropdown')) {
            dropdowns.forEach(function (d) { d.classList.remove('open'); });
        }
    });

    /* ─── Load Email Dropdown Data ───────────────────────── */
    const emailList = document.getElementById('emailList');
    if (emailList) {
        fetch('/dashboard/api/recent-messages/', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data.messages || data.messages.length === 0) {
                emailList.innerHTML = '<div class="empty-state py-4"><i class="bi bi-envelope-open" style="font-size:28px"></i><p class="mt-2 mb-0" style="font-size:13px">No messages yet</p></div>';
                return;
            }
            var html = '';
            data.messages.forEach(function (m) {
                html += '<a href="/dashboard/messages/' + m.id + '/" class="dropdown-item-msg ' + (m.is_unread ? 'unread' : '') + '">';
                html += '<div class="dropdown-item-icon" style="background:#ecfdf5;color:#059669"><i class="bi bi-person-fill"></i></div>';
                html += '<div class="dropdown-item-body">';
                html += '<h6>' + escapeHtml(m.full_name) + '</h6>';
                html += '<p>' + escapeHtml(m.subject) + '</p>';
                html += '<small>' + escapeHtml(m.time) + '</small>';
                html += '</div></a>';
            });
            emailList.innerHTML = html;
        })
        .catch(function () {
            emailList.innerHTML = '<div class="dropdown-loading">Failed to load</div>';
        });
    }

    /* ─── Load Notification Dropdown Data ────────────────── */
    var notifList = document.getElementById('notifList');
    if (notifList) {
        fetch('/dashboard/api/recent-notifications/', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data.notifications || data.notifications.length === 0) {
                notifList.innerHTML = '<div class="empty-state py-4"><i class="bi bi-bell-slash" style="font-size:28px"></i><p class="mt-2 mb-0" style="font-size:13px">No notifications</p></div>';
                return;
            }
            var html = '';
            data.notifications.forEach(function (n) {
                var iconClass = getNotifIcon(n.type);
                html += '<div class="dropdown-item-msg ' + (!n.is_read ? 'unread' : '') + '">';
                html += '<div class="dropdown-item-icon ' + iconClass + '"><i class="bi ' + getNotifBiIcon(n.type) + '"></i></div>';
                html += '<div class="dropdown-item-body">';
                html += '<h6>' + escapeHtml(n.title) + '</h6>';
                html += '<p>' + escapeHtml(n.description) + '</p>';
                html += '<small>' + escapeHtml(n.time) + '</small>';
                html += '</div></div>';
            });
            notifList.innerHTML = html;
        })
        .catch(function () {
            notifList.innerHTML = '<div class="dropdown-loading">Failed to load</div>';
        });
    }

    /* ─── Animated Counters ──────────────────────────────── */
    var counters = document.querySelectorAll('.stat-value[data-count]');
    counters.forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count'));
        if (isNaN(target) || target === 0) return;
        var text = el.textContent;
        var prefix = '';
        var suffix = '';
        if (text.startsWith('₹')) prefix = '₹';
        animateCounter(el, 0, target, 1200, prefix, suffix);
    });

    function animateCounter(el, start, end, duration, prefix, suffix) {
        var startTime = null;
        prefix = prefix || '';
        suffix = suffix || '';

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = easeOutCubic(progress);
            var current = Math.floor(start + (end - start) * eased);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    /* ─── Global Search ──────────────────────────────────── */
    var globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        var searchTimeout;
        globalSearch.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            var query = this.value.trim();
            searchTimeout = setTimeout(function () {
                if (query.length >= 2) {
                    // Determine which page to search based on current URL
                    var path = window.location.pathname;
                    var searchUrl = '';
                    if (path.includes('product')) {
                        searchUrl = '/dashboard/products/?search=' + encodeURIComponent(query);
                    } else if (path.includes('order')) {
                        searchUrl = '/dashboard/orders/?search=' + encodeURIComponent(query);
                    } else if (path.includes('customer')) {
                        searchUrl = '/dashboard/customers/?search=' + encodeURIComponent(query);
                    } else if (path.includes('message')) {
                        searchUrl = '/dashboard/messages/?search=' + encodeURIComponent(query);
                    } else {
                        // Default: search products
                        searchUrl = '/dashboard/products/?search=' + encodeURIComponent(query);
                    }
                    window.location.href = searchUrl;
                }
            }, 600);
        });
    }

    /* ─── Auto-dismiss toasts ────────────────────────────── */
    var toasts = document.querySelectorAll('.toast.show');
    toasts.forEach(function (toast) {
        setTimeout(function () {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 4000);
    });

    /* ─── Utility Functions ──────────────────────────────── */
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getNotifIcon(type) {
        var map = {
            product: 'notif-product',
            order: 'notif-order',
            customer: 'notif-customer',
            message: 'notif-message',
            system: 'notif-system'
        };
        return map[type] || 'notif-system';
    }

    function getNotifBiIcon(type) {
        var map = {
            product: 'bi-box-seam',
            order: 'bi-cart3',
            customer: 'bi-person-plus',
            message: 'bi-envelope',
            system: 'bi-bell'
        };
        return map[type] || 'bi-bell';
    }

    /* ─── Image Preview on Upload ────────────────────────── */
    var fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(function (input) {
        input.addEventListener('change', function () {
            var file = this.files[0];
            if (!file) return;
            var placeholder = this.closest('.image-upload-area').querySelector('.upload-placeholder');
            if (placeholder) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    placeholder.innerHTML = '<img src="' + e.target.result + '" style="max-height:150px;width:100%;object-fit:cover;border-radius:8px">';
                };
                reader.readAsDataURL(file);
            }
        });
    });

    /* ─── Confirm Delete ─────────────────────────────────── */
    var deleteForms = document.querySelectorAll('form[onsubmit*="confirm"]');
    deleteForms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
            if (!confirm('Are you sure you want to delete this? This action cannot be undone.')) {
                e.preventDefault();
            }
        });
    });

    /* ─── Close sidebar on nav link click (mobile) ───────── */
    var navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth < 992) {
                closeSidebar();
            }
        });
    });

});
