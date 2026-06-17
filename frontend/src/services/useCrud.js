import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

export function useCrud(service, { entityName = 'registro', enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const toast = useToast();

  const carregar = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await service.listar();
      setItems(data);
    } catch (err) {
      const msg = err.response?.data?.erro || `Erro ao carregar ${entityName}s.`;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [service, entityName, toast, enabled]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function criar(payload) {
    try {
      await service.criar(payload);
      toast.success(`${capitalize(entityName)} criado(a) com sucesso!`);
      await carregar();
      return true;
    } catch (err) {
      const msg = err.response?.data?.erro || `Erro ao criar ${entityName}.`;
      toast.error(msg);
      return false;
    }
  }

  async function atualizar(id, payload) {
    try {
      await service.atualizar(id, payload);
      toast.success(`${capitalize(entityName)} atualizado(a) com sucesso!`);
      await carregar();
      return true;
    } catch (err) {
      const msg = err.response?.data?.erro || `Erro ao atualizar ${entityName}.`;
      toast.error(msg);
      return false;
    }
  }

  async function remover(id) {
    try {
      await service.deletar(id);
      toast.success(`${capitalize(entityName)} removido(a) com sucesso!`);
      await carregar();
      return true;
    } catch (err) {
      const msg = err.response?.data?.erro || `Erro ao remover ${entityName}.`;
      toast.error(msg);
      return false;
    }
  }

  return { items, loading, error, criar, atualizar, remover, recarregar: carregar };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}