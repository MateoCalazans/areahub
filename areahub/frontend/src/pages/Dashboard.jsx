/**
 * Página Dashboard
 * Responsável pela exibição do dashboard principal da aplicação
 */

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao AreaHub!</p>
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Minhas Reservas</h3>
          <p>Gerenciar suas reservas</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Áreas Disponíveis</h3>
          <p>Visualizar áreas comuns</p>
        </div>
        <div style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
          <h3>Perfil</h3>
          <p>Gerenciar informações da conta</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
