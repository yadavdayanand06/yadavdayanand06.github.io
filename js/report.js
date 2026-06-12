document.addEventListener('DOMContentLoaded', () => {
  let allLeads = [];
  const leadsTableBody = document.getElementById('leadsTableBody');
  const searchInput = document.getElementById('searchInput');
  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const errorAlert = document.getElementById('errorAlert');

  // 1. Session check guard
  const checkSession = () => {
    const sessionActive = localStorage.getItem('demo_session_active');
    if (sessionActive !== 'true') {
      window.location.href = 'login.html'; // redirect to relative login page
      return false;
    }
    return true;
  };

  if (!checkSession()) return;

  // 2. Seed mock data if localStorage is empty
  const seedMockLeads = () => {
    let leads = JSON.parse(localStorage.getItem('demo_leads')) || [];
    if (leads.length === 0) {
      leads = [
        {
          id: 1,
          name: "Rohan Sharma",
          email: "rohan.sharma@nitk.edu",
          phone: "9876543210",
          college: "NIT Karnataka",
          academic_year: "Third Year",
          major: "Computer Science / IT",
          created_at: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
        },
        {
          id: 2,
          name: "Ananya Iyer",
          email: "ananya.iyer@bits-pilani.ac.in",
          phone: "8765432109",
          college: "BITS Pilani",
          academic_year: "Fourth Year",
          major: "Engineering",
          created_at: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
        },
        {
          id: 3,
          name: "Vikram Aditya",
          email: "vikram.aditya@iitd.ac.in",
          phone: "7654321098",
          college: "IIT Delhi",
          academic_year: "Second Year",
          major: "Science / Mathematics",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
        }
      ];
      localStorage.setItem('demo_leads', JSON.stringify(leads));
    }
    return leads;
  };

  const loadLeads = () => {
    try {
      allLeads = seedMockLeads();
      renderLeads(allLeads);
    } catch (err) {
      console.error('Leads fetching error:', err);
      showError('Failed to load mock leads database.');
    }
  };

  // 3. Render leads in the HTML table
  const renderLeads = (leads) => {
    leadsTableBody.innerHTML = '';
    
    if (leads.length === 0) {
      leadsTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-secondary); padding: 30px;">
            No student registrations found.
          </td>
        </tr>
      `;
      return;
    }

    leads.forEach(lead => {
      const row = document.createElement('tr');
      
      const dateStr = new Date(lead.created_at).toLocaleString('en-IN', {
        hour12: true
      });

      row.innerHTML = `
        <td>${lead.id}</td>
        <td style="font-weight: 600; color: var(--text-primary);">${escapeHtml(lead.name)}</td>
        <td><a href="mailto:${escapeHtml(lead.email)}" style="color: var(--accent-blue); text-decoration: underline;">${escapeHtml(lead.email)}</a></td>
        <td>${escapeHtml(lead.phone)}</td>
        <td>${escapeHtml(lead.college)}</td>
        <td><span class="badge badge-year">${escapeHtml(lead.academic_year)}</span></td>
        <td><span class="badge badge-major">${escapeHtml(lead.major)}</span></td>
        <td style="color: var(--text-secondary); font-size: 0.9rem;">${dateStr}</td>
      `;
      leadsTableBody.appendChild(row);
    });
  };

  // Live Query Filter
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      renderLeads(allLeads);
      return;
    }

    const filtered = allLeads.filter(lead => {
      return (
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.college.toLowerCase().includes(query) ||
        lead.major.toLowerCase().includes(query)
      );
    });
    renderLeads(filtered);
  });

  // 4. Export Leads to CSV
  downloadCsvBtn.addEventListener('click', () => {
    if (allLeads.length === 0) {
      alert('No leads available to export.');
      return;
    }

    let csvContent = 'ID,Full Name,Email Address,Phone Number,College/University,Academic Year,Major/Field of Study,Registration Timestamp\r\n';

    allLeads.forEach(lead => {
      const dateStr = new Date(lead.created_at).toISOString();
      const name = `"${lead.name.replace(/"/g, '""')}"`;
      const email = `"${lead.email.replace(/"/g, '""')}"`;
      const phone = `"${lead.phone.replace(/"/g, '""')}"`;
      const college = `"${lead.college.replace(/"/g, '""')}"`;
      const year = `"${lead.academic_year.replace(/"/g, '""')}"`;
      const major = `"${lead.major.replace(/"/g, '""')}"`;

      csvContent += `${lead.id},${name},${email},${phone},${college},${year},${major},${dateStr}\r\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_report_${today}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // 5. Logout Action
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('demo_session_active');
    localStorage.removeItem('demo_session_username');
    window.location.href = 'login.html';
  });

  const showError = (msg) => {
    errorAlert.textContent = msg;
    errorAlert.style.display = 'block';
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Boot load
  loadLeads();
});
