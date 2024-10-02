import { spec } from 'pactum';

describe('Testes da API de Company', () => {
  const apiUrl = 'https://api-desafio-qa.onrender.com/company';
  let companyId: string;

  it('deve criar uma nova empresa', async () => {
    const newCompany = {
      name: 'Empresa Teste',
      location: 'Localização Teste',
      // Adicione outros campos conforme necessário
    };

    const response = await spec()
      .post(apiUrl)
      .withJson(newCompany)
      .expectStatus(201)
      .returns('id'); // Armazena o ID da nova empresa

    companyId = response; // Armazena o ID
  });

  it('deve obter todas as empresas', async () => {
    await spec()
      .get(apiUrl)
      .expectStatus(200)
      .expectJsonMatch('$', [{ id: '$.id' }]) // Verifica se retorna uma lista
      .toss();
  });

  it('deve obter uma empresa pelo ID', async () => {
    await spec()
      .get(`${apiUrl}/${companyId}`)
      .expectStatus(200)
      .expectJsonMatch('$.id', companyId)
      .toss();
  });

  it('deve atualizar a empresa', async () => {
    const updatedData = { name: 'Empresa Teste Atualizada' };
    await spec()
      .put(apiUrl)
      .withJson({ id: companyId, ...updatedData })
      .expectStatus(200)
      .expectJsonMatch('$.name', updatedData.name)
      .toss();
  });

  it('deve deletar a empresa', async () => {
    await spec()
      .delete(`${apiUrl}/${companyId}`)
      .expectStatus(204)
      .toss();
  });

  it('deve retornar 404 ao tentar obter uma empresa inexistente', async () => {
    await spec()
      .get(`${apiUrl}/${companyId}`)
      .expectStatus(404)
      .toss();
  });
});

describe('Testes de Produtos', () => {
  let productId: string;

  it('deve adicionar um produto à empresa', async () => {
    const newProduct = { name: 'Produto Teste', price: 100 }; // Adicione os campos necessários
    const response = await spec()
      .post(`${apiUrl}/${companyId}/products`)
      .withJson(newProduct)
      .expectStatus(201)
      .returns('id'); // Armazena o ID do novo produto

    productId = response; // Armazena o ID
  });

  it('deve obter todos os produtos da empresa', async () => {
    await spec()
      .get(`${apiUrl}/${companyId}/products`)
      .expectStatus(200)
      .expectJsonMatch('$', [{ id: '$.id' }]) // Verifica se retorna uma lista
      .toss();
  });

  it('deve obter um produto específico', async () => {
    await spec()
      .get(`${apiUrl}/${companyId}/products/${productId}`)
      .expectStatus(200)
      .expectJsonMatch('$.id', productId)
      .toss();
  });

  it('deve atualizar um produto específico', async () => {
    const updatedData = { name: 'Produto Teste Atualizado' };
    await spec()
      .put(`${apiUrl}/${companyId}/products/${productId}`)
      .withJson(updatedData)
      .expectStatus(200)
      .expectJsonMatch('$.name', updatedData.name)
      .toss();
  });

  it('deve deletar um produto específico', async () => {
    await spec()
      .delete(`${apiUrl}/${companyId}/products/${productId}`)
      .expectStatus(204)
      .toss();
  });
});