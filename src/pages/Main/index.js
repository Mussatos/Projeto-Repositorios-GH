import { Link } from "react-router-dom";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa'
import { Container, SubmitButton, Form, List, DeleteButton } from './styles'
import { useState, useCallback } from "react";
import api from '../../services/api';


export default function Main() {


    const [newRepo, setNewRepo] = useState('');
    const [repositorios, setRepositorios] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = useCallback((e) => {

        e.preventDefault();

        async function submit() {
            setLoading(true);
            try {
                const response = await api.get(`repos/${newRepo}`)

                const data = {
                    name: response.data.full_name
                }

                setRepositorios([...repositorios, data]);
                setNewRepo('');
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        submit();

    }, [newRepo, repositorios]); //Quando uma ou outra dessas States forem atualizadas vai chamar o Callback

    function handleinputChange(e) {
        setNewRepo(e.target.value);
    }

    const handleDelete = useCallback((item) =>{
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

                <Form onSubmit={handleSubmit}>

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
                                            <FaTrash size={14}/>
                                        </DeleteButton>
                                        {item.name}
                                    </span>

                                    <a href="">
                                        <FaBars size={20} />
                                    </a>
                                </li>

                            )
                        })
                    }
                </List>

            </Container>



            <Link to='/repo'>Repositorio</Link>
        </div>
    );
}