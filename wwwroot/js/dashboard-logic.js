document.addEventListener('DOMContentLoaded', () => {
    const addShoeForm = document.getElementById('add-shoe-form');
    const shoesTableBody = document.querySelector('#shoes-table tbody');

    const fetchShoes = async () => {
        try {
            const response = await fetch('/api/Shoes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const shoesData = await response.json();
            console.log('API Response Data:', JSON.stringify(shoesData, null, 2));
            renderShoes(shoesData);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
        }
    };

    const renderShoes = (shoes) => {
        if (!shoesTableBody) {
            console.error('CRITICAL: Could not find the shoes table body element.');
            return;
        }

        if (!Array.isArray(shoes)) {
            console.error('Data received is not an array:', shoes);
            shoesTableBody.innerHTML = '<tr><td colspan="6">Erro ao carregar os dados. Verifique o console.</td></tr>';
            return;
        }

        const rowsHtml = shoes.map(shoe => {
            const price = (typeof shoe.price === 'number') ? shoe.price.toFixed(2) : '0.00';
            return `
                <tr data-id="${shoe.id}">
                    <td>${shoe.id}</td>
                    <td>${shoe.name}</td>
                    <td>${shoe.category}</td>
                    <td>R$${price}</td>
                    <td><img src="${shoe.image}" alt="${shoe.name}" width="100"></td>
                    <td>
                        <div class="action-buttons">
                            <button class="edit-button" data-id="${shoe.id}">Editar</button>
                            <button class="delete-button" data-id="${shoe.id}">Deletar</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        shoesTableBody.innerHTML = rowsHtml;
    };

    if (addShoeForm) {
        addShoeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(addShoeForm);

            try {
                const response = await fetch('/api/Shoes', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    addShoeForm.reset();
                    fetchShoes();
                    Swal.fire('Adicionado!','O novo sapato foi adicionado com sucesso.','success');
                } else {
                    console.error('Erro ao adicionar sapato:', await response.text());
                }
            } catch (error) {
                console.error('Erro ao adicionar sapato:', error);
            }
        });
    }

    const handleEdit = async (shoeId) => {
        try {
            const response = await fetch(`/api/Shoes/${shoeId}`);
            if (!response.ok) throw new Error('Failed to fetch shoe data.');
            const shoe = await response.json();

            Swal.fire({
                title: 'Editar Sapato',
                html: `
                    <input id="swal-name" class="swal2-input" value="${shoe.name}">
                    <input id="swal-category" class="swal2-input" value="${shoe.category}">
                    <input id="swal-price" class="swal2-input" type="number" step="0.01" value="${shoe.price}">
                `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Salvar',
                cancelButtonText: 'Cancelar',
                preConfirm: () => {
                    return {
                        Id: shoe.id,
                        Name: document.getElementById('swal-name').value,
                        Category: document.getElementById('swal-category').value,
                        Price: parseFloat(document.getElementById('swal-price').value),
                        Image: shoe.image
                    }
                }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const updatedShoe = result.value;
                    const putResponse = await fetch(`/api/Shoes/${shoeId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedShoe)
                    });

                    if (putResponse.ok) {
                        fetchShoes();
                        Swal.fire('Salvo!', 'As alterações foram salvas.', 'success');
                    } else {
                        Swal.fire('Erro!', 'Não foi possível salvar as alterações.', 'error');
                    }
                }
            });
        } catch (error) {
            console.error("Error in edit process:", error);
            Swal.fire('Erro!', 'Não foi possível carregar os dados para edição.', 'error');
        }
    };

    if (shoesTableBody) {
        shoesTableBody.addEventListener('click', async (e) => {
            const target = e.target;
            const shoeId = target.dataset.id;

            if (target.classList.contains('edit-button')) {
                handleEdit(shoeId);
            } else if (target.classList.contains('delete-button')) {
                Swal.fire({
                    title: 'Você tem certeza?',
                    text: "Você não poderá reverter isso!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Sim, deletar!',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await fetch(`/api/Shoes/${shoeId}`, { method: 'DELETE' });
                            if (response.ok) {
                                fetchShoes();
                                Swal.fire('Deletado!','O sapato foi deletado.','success');
                            } else {
                                Swal.fire('Erro!', 'Não foi possível deletar o sapato.', 'error');
                            }
                        } catch (error) {
                            console.error("Error deleting shoe:", error);
                            Swal.fire('Erro!', 'Ocorreu um problema na exclusão.', 'error');
                        }
                    }
                });
            }
        });
    }

    // Initial load
    fetchShoes();
});