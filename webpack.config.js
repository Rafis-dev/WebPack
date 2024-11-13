// Определяет режим сборки — development для разработки или production для продакшна. Если переменная окружения NODE_ENV не задана, по умолчанию используется development.
const mode = process.env.NODE_ENV || 'development';
// Устанавливает целевую платформу. Для разработки (development) используется web для обеспечения совместимости с современными браузерами. В продакшене (browserslist) применяются настройки совместимости согласно browserslist.
const target = mode === 'development' ? 'web' : 'browserslist';
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Включает генерацию source map в режиме разработки для удобной отладки кода. В продакшене отключено, чтобы уменьшить размер выходных файлов.
const devtool = mode === 'development' ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    // Включает Hot Module Replacement (HMR), позволяя обновлять модули без перезагрузки страницы в режиме разработки.
    hot: true,
  },
  // Главный файл приложения.
  entry: './src/script.js',
  output: {
    // Использует [name] для имени чанка и [contenthash] для обеспечения уникальности файлов, чтобы браузеры не кешировали старые версии.
    filename: '[name][contenthash].js',
    // Указывает директорию для выходных файлов
    path: path.resolve(__dirname, 'dist'),
    // Удаляет старые файлы из папки dist перед каждой сборкой.
    clean: true,
    // Устанавливает шаблон имени файлов для ресурсов, таких как изображения и шрифты, включая хэш для кеширования.
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
  plugins: [
    // Создает HTML-файл на основе шаблона ./src/index.html, автоматически подключая к нему сгенерированные JS и CSS файлы.
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // Выносит CSS в отдельные файлы, используя [name] и [contenthash] для предотвращения кеширования старых стилей.
    new MiniCssExtractPlugin({
      filename: '[name][contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        // Позволяет импортировать HTML-файлы как строки JavaScript.
        loader: 'html-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          //  Преобразует CSS в модули JavaScript.
          'css-loader',
          // Подключает PostCSS для добавления автопрефиксов или других постобработок.
          'postcss-loader',
          // Компилирует SCSS/SASS в CSS.
          'sass-loader',
        ],
      },
      {
        //Копирует файлы ресурсов в указанную директорию и генерирует их ссылки.
        test: /\.(jpg|jpeg|png|svg|gif|avif|webp)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff2|woff|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          // Транспилирует современный JS в более совместимый код.
          loader: 'babel-loader',
          options: {
            // Включает кэширование для ускорения повторных сборок.
            cacheDirectory: true,
          },
        },
      },
    ],
  },
};
