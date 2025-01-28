import { Link } from "react-router-dom";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, SubmitButton, Form, List, DeleteButton } from './styles'
import { useState, useCallback, useEffect } from "react";
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Main() {

    const [newRepo, setNewRepo] = useState('');

    // // DidMount (buscar)
    const [repositorios, setRepositorios] = useState(() => {
        const repoStorage = localStorage.getItem('@repos');
        return repoStorage ? JSON.parse(repoStorage) : [];
    });

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);



    // DidUpdate (salvar alterações)
    useEffect(() => {
        if (repositorios.length > 0) {
            localStorage.setItem('@repos', JSON.stringify(repositorios));
        }
    }, [repositorios]);

    const handleSubmit = useCallback((e) => {

        e.preventDefault();

        async function submit() {
            setLoading(true);
            setAlert(null);
            try {
                if (newRepo === '') {
                    throw new Error('Você precisa indicar um repositório!');
                }
                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo)

                if (hasRepo) {
                    throw new Error('Repositório duplicado!');
                }

                const data = {
                    name: response.data.full_name
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                setAlert(true);
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        submit();

    }, [newRepo, repositorios]); //Quando uma ou outra dessas States forem atualizadas vai chamar o Callback

    function handleinputChange(e) {
        setNewRepo(e.target.value);
        setAlert(false);
    }

    const handleDelete = useCallback((item) => {
        const find = repositorios.filter(r => r.name !== item) //ele vai devolver todos os repositorios que forem diferentes do clicado

        setRepositorios(find);

    }, [repositorios]);


    return (
        <div>
            <Container>
                <h1>
                    <FaGithub size={25} />
                    Meus Repositorios
                </h1>

                <Form onSubmit={handleSubmit} error={alert}>

                    <input type="text"
                        placeholder="Adicionar repositórios"
                        value={newRepo}
                        onChange={handleinputChange}
                    />

                    <SubmitButton loading={loading ? 1 : 0}>
                        {
                            loading ? (
                                <FaSpinner size={14} color="#FFF" />
                            ) : (
                                <FaPlus size={14} color="#FFF" />
                            )
                        }

                    </SubmitButton>

                </Form>

                <List>
                    {
                        repositorios.map((item) => {
                            return (
                                <li key={item.name}>

                                    <span>
                                        <DeleteButton onClick={() => handleDelete(item.name)}>
                                            <FaTrash size={14} />
                                        </DeleteButton>
                                        {item.name}
                                    </span>

                                    <Link to={`/repo/${encodeURIComponent(item.name)}`}> 
                                                        {/* encodeURIComponent transforma a url num parametro só.
                                                        isso resolve o problema que estava acontecendo por causa da url ser 
                                                        /angular/angular, e isso estava sendo interpretado como dois níveis de pagina */}
                                        <FaBars size={20} />
                                    </Link>
                                </li>

                            )
                        })
                    }
                </List>

            </Container>

        </div>
    );
}