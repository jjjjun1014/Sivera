/**
 * 테이블 편집 상태 관리 Hook
 * useReducer로 복잡한 편집 상태를 효율적으로 관리
 */

import { useReducer, useCallback } from 'react';

export interface EditingState<T = any> {
  editingCell: { id: number | string; field: string } | null;
  tempValues: Record<string, T>;
  pendingChange: {
    id: number | string;
    field: string;
    value: T;
    oldValue: T;
  } | null;
}

type EditingAction<T = any> =
  | { type: 'START_EDIT'; payload: { id: number | string; field: string } }
  | { type: 'UPDATE_TEMP'; payload: { key: string; value: T } }
  | { type: 'SET_PENDING'; payload: EditingState<T>['pendingChange'] }
  | { type: 'CANCEL_EDIT' }
  | { type: 'CONFIRM_EDIT' }
  | { type: 'RESET' };

function editingReducer<T>(state: EditingState<T>, action: EditingAction<T>): EditingState<T> {
  switch (action.type) {
    case 'START_EDIT':
      return {
        ...state,
        editingCell: action.payload,
      };

    case 'UPDATE_TEMP':
      return {
        ...state,
        tempValues: {
          ...state.tempValues,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'SET_PENDING':
      return {
        ...state,
        pendingChange: action.payload,
      };

    case 'CANCEL_EDIT':
      return {
        ...state,
        editingCell: null,
        tempValues: {},
        pendingChange: null,
      };

    case 'CONFIRM_EDIT':
      return {
        ...state,
        editingCell: null,
        tempValues: {},
        pendingChange: null,
      };

    case 'RESET':
      return {
        editingCell: null,
        tempValues: {},
        pendingChange: null,
      };

    default:
      return state;
  }
}

export function useTableEditing<T = any>() {
  const [state, dispatch] = useReducer(editingReducer<T>, {
    editingCell: null,
    tempValues: {},
    pendingChange: null,
  });

  const startEdit = useCallback((id: number | string, field: string) => {
    dispatch({ type: 'START_EDIT', payload: { id, field } });
  }, []);

  const updateTemp = useCallback((key: string, value: T) => {
    dispatch({ type: 'UPDATE_TEMP', payload: { key, value } });
  }, []);

  const setPending = useCallback((pending: EditingState<T>['pendingChange']) => {
    dispatch({ type: 'SET_PENDING', payload: pending });
  }, []);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'CANCEL_EDIT' });
  }, []);

  const confirmEdit = useCallback(() => {
    dispatch({ type: 'CONFIRM_EDIT' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // 하위 호환성을 위해 state의 속성들을 직접 반환
  const setEditingCell = useCallback((cell: { id: number | string; field: string } | null) => {
    if (cell) {
      dispatch({ type: 'START_EDIT', payload: cell });
    } else {
      dispatch({ type: 'CANCEL_EDIT' });
    }
  }, []);

  const updateTempValue = updateTemp;
  const setTempValues = useCallback((updater: ((prev: Record<string, T>) => Record<string, T>) | Record<string, T>) => {
    if (typeof updater === 'function') {
      const newValues = updater(state.tempValues);
      Object.entries(newValues).forEach(([key, value]) => {
        dispatch({ type: 'UPDATE_TEMP', payload: { key, value } });
      });
    } else {
      Object.entries(updater).forEach(([key, value]) => {
        dispatch({ type: 'UPDATE_TEMP', payload: { key, value } });
      });
    }
  }, [state.tempValues]);

  return {
    // 상태 (직접 접근)
    editingCell: state.editingCell,
    tempValues: state.tempValues,
    pendingChange: state.pendingChange,
    
    // 상태 (객체로 접근 - CampaignTable용)
    state,
    
    // 액션 (새 API)
    startEdit,
    updateTemp,
    updateTempValue,
    setPending,
    cancelEdit,
    confirmEdit,
    reset,
    
    // 하위 호환 (기존 API)
    setEditingCell,
    setTempValues,
  };
}
