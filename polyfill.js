import 'intl';
import 'intl/locale-data/jsonp/pt-BR'; // Ou o idioma desejado, se for diferente

if (typeof Intl.__disableRegExpRestore === 'function') {
  Intl.__disableRegExpRestore();
}