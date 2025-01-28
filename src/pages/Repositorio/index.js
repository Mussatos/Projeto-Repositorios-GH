import { Container, Owner, Loading, BackButton, IssuesList, PageActions } from './styles'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import api from '../../services/api'
import { useParams } from 'react-router-dom';


export default function Repositorio() {

    const { repositorio } = useParams();

    const [repositorioDetail, setRepositorioDetail] = useState({});
    const [issuesDetail, setIssuesDetail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        async function load() {

            const nomeRepo = repositorio;

            //Podemos fazer as requisições de uma forma separada ou com um array de Promise
            //Nesse caso irei optar pelo array

            //Exemplo das requisições separadas:
            // const response = await api.get(`/repos/${nomeRepo}`);
            // const issues = await api.get(`/repos/${nomeRepo}/issues`);

            //primeira posição recebe o primeiro api.get e a segunda posição o segundo api.get
            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: 'open',
                        per_page: 5
                    }
                })
            ])
            setRepositorioDetail(repositorioData.data);
            setIssuesDetail(issuesData.data)
            setLoading(false)

        }
        load();
    }, [repositorio])

    useEffect(()=>{

        async function loadIssue() {
            const nomeRepo = repositorio;

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: 'open',
                    page: page,
                    per_page: 5
                }
            })
            setIssuesDetail(response.data);
        }

        loadIssue();

    }, [repositorio, page])

    function handlePage(action){
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return (
        <div>
            <Container>

                <BackButton to='/'>
                    <FaArrowLeft color='#000' size={35} />
                </BackButton>

                <Owner>
                    <img src={repositorioDetail.owner.avatar_url} alt={repositorioDetail.login} />
                    <h1>
                        {repositorioDetail.name}
                    </h1>
                    <p>{repositorioDetail.description}</p>
                </Owner>

                <IssuesList>
                    {
                        issuesDetail.map((item) => {
                            return (
                                <li key={item.id}>
                                    <img src={item.user.avatar_url} alt={item.user.login} />

                                    <div>
                                        <strong>
                                            <a href={item.html_url}>{item.title}</a>

                                            {
                                                item.labels.map((label) => {
                                                    return (
                                                        <span key={label.id}>
                                                            {label.name}
                                                        </span>
                                                    )
                                                })
                                            }
                                        </strong>
                                        <p>{item.user.login}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </IssuesList>

                <PageActions>

                    <button 
                    disabled={page < 2}
                    type='button' 
                    onClick={() => handlePage('back')}>
                        Voltar
                    </button>

                    <button type='button' onClick={() => handlePage('next')}>
                        Próxima
                    </button>
                </PageActions>

            </Container>
        </div>
    )
}