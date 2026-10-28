const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class QueryBuilder {
    constructor(table) {
        this.table = table;
        this.filters = [];
        this.orderField = null;
        this.orderAscending = false;
        this.limitValue = null;
        this.isSingle = false;
    }

    select(_columns = '*') {
        return this;
    }

    eq(field, value) {
        this.filters.push({ field, value });
        return this;
    }

    order(field, { ascending = false } = {}) {
        this.orderField = field;
        this.orderAscending = ascending;
        return this;
    }

    limit(value) {
        this.limitValue = value;
        return this;
    }

    single() {
        this.isSingle = true;
        return this;
    }

    async then(resolve, reject) {
        try {
            const result = await this.execute();
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }

    async execute() {
        try {
            // Si hay filtro por 'id', usamos la ruta de detalle
            const idFilter = this.filters.find(f => f.field === 'id');

            let url;
            if (idFilter) {
                url = `${API_URL}/${this.table}/${idFilter.value}`;
            } else {
                url = `${API_URL}/${this.table}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404 && this.isSingle) {
                    return { data: null, error: { message: 'No encontrado' } };
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            let data = await response.json();

            // Si es un solo objeto (ruta de detalle)
            if (idFilter && !Array.isArray(data)) {
                return { data, error: null };
            }

            // Si es un array, aplicamos orden y límite en el cliente
            if (Array.isArray(data)) {
                if (this.orderField) {
                    data = [...data].sort((a, b) => {
                        const valA = a[this.orderField];
                        const valB = b[this.orderField];
                        if (valA < valB) return this.orderAscending ? -1 : 1;
                        if (valA > valB) return this.orderAscending ? 1 : -1;
                        return 0;
                    });
                }
                if (this.limitValue) {
                    data = data.slice(0, this.limitValue);
                }
            }

            return { data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    }
}

export const supabase = {
    from(table) {
        return new QueryBuilder(table);
    }
};