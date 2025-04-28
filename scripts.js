function searchContacts() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    
    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');
    
    // Fetch data from the JSON endpoint
    fetch('https://bagay-0037.github.io/Folder/author.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');
            
            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a name to search</h5>
                    </div>
                `;
                return;
            }
            
            // Convert single contact object to array for consistent processing
            const contacts = Array.isArray(data) ? data : [data];
            
            const filteredContacts = contacts.filter(contact => 
                contact.author.toLowerCase().includes(searchTerm) ||   contact.title.toLowerCase().includes(searchTerm)
            );
            
            displayResults(filteredContacts);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading contacts</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
            console.error('Error fetching data:', error);
        });
}

function displayResults(contacts) {
    const resultsDiv = document.getElementById('results');
    
    if (contacts.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <h5>No contacts found</h5>
                <p class="text-muted">Try a different search term</p>
            </div>
        `;
        return;
    }
    
    let html = `
        <table class="table contact-table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    contacts.forEach(contact => {
        html += `
            <tr>
                <td>
                    <strong>${contact.title || 'N/A'}</strong>
                </td>
                <td>
                    ${contact.author ? `<div><i class="fas fa-envelope me-2 text-primary"></i> ${contact.author}</div>` : ''}
                </td>
                <td>
                    ${contact.genre ? `<div><i class="fas fa-envelope me-2 text-primary"></i> ${contact.genre}</div>` : ''}
                </td>
                <td>
                    ${contact.available ? `<div class="fas fa-envelope me-2 text-success">Available</div>` : `<div class="fas fa-envelope me-2 text-danger">Checked Out</div>`}
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultsDiv.innerHTML = html;
}
